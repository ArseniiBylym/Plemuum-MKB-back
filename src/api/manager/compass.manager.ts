import CompassDataController from "../../data/datacontroller/compass.datacontroller";
import Organization from "../../data/models/organization/organization.model";
import { UserModel } from "../../data/database/schema/common/user.schema";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import * as lodash from 'lodash';
import { SkillModel } from "../../data/database/schema/organization/compass/skill.schema";
import CompassAnswer from "../../data/models/organization/compass/compassanswer.model";
import Skill from "../../data/models/organization/compass/skill.model";
import StatisticsManager from "./statistics.manager";
import StatisticsDataController from "../../data/datacontroller/statistics.datacontroller";
import { GroupDataController } from "../../data/datacontroller/group.datacontroller";
import Group from "../../data/models/organization/group.model";
import Sentence from "../../data/models/organization/compass/sentence.model";
import { ErrorType, PlenuumError } from "../../util/errorhandler";
import { OrganizationDataController } from "../../data/datacontroller/organization.datacontroller";
import { getRandomItem } from "../../test/util/utils";
import { RequestDataController } from "../../data/datacontroller/request.datacontroller";
import FeedbackDataController from "../../data/datacontroller/feedback.datacontroller";
import filterAsync from '../../util/asyncFilter';
import {OrganizationModel} from "../../data/database/schema/organization/organization.schema";
const parser = require('cron-parser');

export default class CompassManager {

    groupDataController: GroupDataController;
    organizationDataController: OrganizationDataController;
    requestDataController: RequestDataController;

    constructor(groupDataController: GroupDataController, organizationDataController: OrganizationDataController,
                requestDataController: RequestDataController) {
        this.groupDataController = groupDataController;
        this.requestDataController = requestDataController;
        this.organizationDataController = organizationDataController;
    }

    async getTodos(orgId: string, userId: string) {
        const recipientRequests = await this.requestDataController.getRecipientRequests(orgId, userId);
        const activeRequests = await filterAsync(recipientRequests, async (request: any) => {
            const feedbacks = await FeedbackDataController.getFeedbacksForRequest(orgId, request._id, userId);
            if (feedbacks.length === 0) return request
        });
        const compassTodos = await CompassDataController.getTodosForOwner(orgId, userId);
        return {
            requests: activeRequests,
            compassTodo: compassTodos
        }
    };

    async answerCard(aboutUserId: string, ownerId: string, orgId: string) {
        const organization = await this.organizationDataController.getOrganizationByDbName(orgId);
        CompassManager.checkOrganization(organization);

        const aboutUser: UserModel = await CompassManager.getAboutUser(organization.dbName, aboutUserId);
        CompassManager.checkAboutUser(aboutUser);

        const aboutUserGroups = await this.groupDataController.getUserGroups(orgId, aboutUserId);
        const senderUserGroups = await this.groupDataController.getUserGroups(orgId, ownerId);

        const answerGroups: Group[] = [];
        senderUserGroups.forEach((senderGroup) => senderGroup.answerCardRelations.forEach((relationGroupId) => {
            const found = aboutUserGroups.find((aboutGroup) => aboutGroup._id.toString() === relationGroupId);
            if (found) {
                answerGroups.push(found);
            }
        }));

        CompassManager.checkAnswerCardRelation(answerGroups);

        let answerSkillIds: string[] = [];
        answerGroups.forEach((group) => answerSkillIds = answerSkillIds.concat(group.skills));
        const aboutUserSkills = await CompassDataController.getSkillsByIds(orgId, answerSkillIds);
        const todo = CompassManager.buildUpNewTodoResponse(ownerId, organization.todoSentenceNumber, aboutUserId, aboutUserSkills);
        return CompassDataController.saveCompassTodo(organization.dbName, todo);
    }

    async autoGenerateTodo(orgId: string) {
        const organization = await this.organizationDataController.getOrganizationByDbName(orgId);
        const organizationGroups = await this.groupDataController.getGroups(orgId);
        const groupsWithTodoRelations = organizationGroups.filter((group) => group.todoCardRelations.length > 0);

        if (groupsWithTodoRelations.length === 0) {
            throw new PlenuumError("Organization has no group with Todo relations", ErrorType.NOT_FOUND)
        }

        const randomGroup = getRandomItem(groupsWithTodoRelations);
        const randomOwnerUserId = getRandomItem(randomGroup.users);

        const randomAboutGroupId = getRandomItem(randomGroup.todoCardRelations);
        const randomAboutGroup = await this.groupDataController.getGroupById(orgId, randomAboutGroupId);

        const randomAboutUserId = getRandomItem(randomAboutGroup.users);
        const skills = await CompassDataController.getSkillsByIds(orgId, randomAboutGroup.skills);

        const todo = CompassManager.buildUpNewTodoResponse(randomOwnerUserId, organization.todoSentenceNumber, randomAboutGroupId, skills);

        return CompassDataController.saveCompassTodo(organization.dbName, todo);
    }

    static checkAnswerCardRelation(answerGroups: Group[]) {
        if (answerGroups.length === 0) {
            throw new PlenuumError("Sender has no answer card relation to this user", ErrorType.NOT_FOUND);
        }
    }

    static checkOrganization(organization: Organization): Organization {
        if (!organization) {
            throw new PlenuumError('Organization nonexistent!', ErrorType.NOT_FOUND);
        }
        return organization
    }

    static checkAboutUser(user: UserModel): UserModel {
        if (!user) {
            throw new PlenuumError('User could not be found', ErrorType.NOT_FOUND);
        }
        return user;
    }

    static getAboutUser(orgId: string, userId: string): Promise<any> {
        return UserDataController.getUserByIdFromOrg(orgId, userId, ['_id', 'firstName', 'lastName']);
    }

    static buildUpNewTodoResponse(ownerId: string, numberOfSentences: number, aboutUserId: string, skills: SkillModel[]): any {
        let possibleSentences: Sentence[] = [];
        const sentencesToBeAnswered: any[] = [];
        skills.forEach((skill) => possibleSentences = possibleSentences.concat(skill.sentences));

        if (possibleSentences.length < numberOfSentences) {
            numberOfSentences = possibleSentences.length;
        }

        while (numberOfSentences > 0) {
            const randomSkill = skills[lodash.random(0, skills.length - 1, false)];
            if (randomSkill.sentences.length > 0) {
                const randomSentence = randomSkill.sentences[
                    lodash.random(0, randomSkill.sentences.length - 1, false)];
                sentencesToBeAnswered.push({
                    sentence: randomSentence,
                    skill: randomSkill
                });
                lodash.pull(randomSkill.sentences, randomSentence);
                numberOfSentences--;
            }
        }

        return {
            about: aboutUserId,
            owner: ownerId,
            questions: sentencesToBeAnswered,
            answered: false
        };
    }

    static async answerCompass(orgId: string, answer: CompassAnswer): Promise<CompassAnswer> {
        const compassTodo = await CompassDataController.getTodoById(orgId, answer.compassTodo);
        if (!compassTodo) {
            throw new PlenuumError("COMPASS Todo not found", ErrorType.NOT_FOUND);
        }
        compassTodo.answered = true;
        await CompassDataController.updateCompassTodo(orgId, compassTodo);
        const savedAnswer = await CompassDataController.saveCompassAnswer(orgId, answer);
        const statistics = await StatisticsManager.createOrUpdateStatistics(orgId, answer);
        await StatisticsDataController.saveOrUpdateStatistics(orgId, statistics);
        return savedAnswer;
    }

    static async createNewSkill(orgId: string, skill: Skill): Promise<SkillModel> {
        return CompassDataController.saveSkill(orgId, skill);
    }

    static async createOrUpdateSkill(orgId: string, skill: SkillModel): Promise<SkillModel> {
        return CompassDataController.createOrUpdateSkill(orgId, skill);
    }

    async getSkills(orgId: string) {
        return CompassDataController.getAllSkills(orgId);
    }

    async getStatistics(orgId: string, userId: string) {
        const userGroups: Group[] = await this.groupDataController.getUserGroups(orgId, userId);
        const statistics = await StatisticsManager.getStatistics(orgId, userId, userGroups);
        await StatisticsDataController.saveOrUpdateStatistics(orgId, statistics);
        return await StatisticsDataController.getStatisticsByUserId(orgId, userId);
    }

    async autoGenerateTodosForOrganization(org: OrganizationModel) {
        const { name, dbName } = org;
        const users = await UserDataController.getOrganizationUsers(name);
        if (users.length > 0) {
            await users.forEach(async (user) => {
                const userGroups: Group[] = await this.groupDataController.getUserGroups(name, user._id);
                const groupsWithTodoRelations = userGroups.filter((group) => group.todoCardRelations.length > 0);

                if (groupsWithTodoRelations.length > 0) {
                    const randomGroup = getRandomItem(groupsWithTodoRelations);
                    const usersTopick = randomGroup.users.filter((element: any) => user._id !== element._id);
                    const randomAboutUserId = getRandomItem(usersTopick);
                    const skills = await CompassDataController.getSkillsByIds(name, randomGroup.skills);
                    const todo = CompassManager.buildUpNewTodoResponse(
                        user._id, org.todoSentenceNumber, randomAboutUserId, skills);
                    await CompassDataController.saveCompassTodo(dbName, todo);
                }
            });
            return {"message": "Todos were generated successfully"};
        }else{
            throw new PlenuumError("No user found that can receive a todo.", ErrorType.NOT_FOUND);
        }
    }

    async generateTodo() {
        let organizations = await this.organizationDataController.getOrganizations();
        if (organizations.length > 0){
            return Promise.all(organizations.map(async (org: OrganizationModel) => {
                return await this.autoGenerateTodosForOrganization(org);
            })).then(value => value.reduce((_, currentValue) => currentValue));
        }else{
            throw new PlenuumError("No organization found to generate todo.", ErrorType.NOT_FOUND);
        }
    }

    async startWorker(){
        let organizations = await this.organizationDataController.getOrganizations();
        return Promise.all(organizations.map(async (org: OrganizationModel) => {
            //TODO Franclin: we shouldn't save the compass generation time as cron expression -> please convert the number into cron
            const interval = parser.parseExpression(org.compassGenerationTime);
            const now = new Date();
            if (interval.next().getDate() === now.getDate()){
                return await this.autoGenerateTodosForOrganization(org)
            }
        })).then((value => value.reduce((_, currentValue) => currentValue)));
    }
}