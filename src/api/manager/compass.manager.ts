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
import { OrganizationModel } from "../../data/database/schema/organization/organization.schema";
import { GroupModel } from "../../data/database/schema/organization/group.schema";
import { CompassStatisticsModel } from "../../data/database/schema/organization/compass/compass.statistics.schema";
import NotificationManager from "./notification.manager";
import { TEMPLATE } from "../../service/notification/notification.service";

const parser = require('cron-parser');

export default class CompassManager {

    groupDataController: GroupDataController;
    organizationDataController: OrganizationDataController;
    requestDataController: RequestDataController;
    notificationManager: NotificationManager;

    constructor(groupDataController: GroupDataController, organizationDataController: OrganizationDataController,
                requestDataController: RequestDataController, notificationManager: NotificationManager) {
        this.groupDataController = groupDataController;
        this.requestDataController = requestDataController;
        this.organizationDataController = organizationDataController;
        this.notificationManager = notificationManager;
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

    async answerCompass(orgId: string, answer: CompassAnswer): Promise<CompassAnswer> {
        const compassTodo = await CompassDataController.getTodoById(orgId, answer.compassTodo);
        if (!compassTodo) {
            throw new PlenuumError("COMPASS Todo not found", ErrorType.NOT_FOUND);
        }
        compassTodo.answered = true;
        await CompassDataController.updateCompassTodo(orgId, compassTodo);
        const savedAnswer = await CompassDataController.saveCompassAnswer(orgId, answer);
        const statistics = await StatisticsManager.createOrUpdateStatistics(orgId, answer);
        await StatisticsDataController.saveOrUpdateStatistics(orgId, statistics);

        console.log("answerCompass");
        // Send notification
        try {
            await this.notificationManager.sendNotificationById(compassTodo.about, TEMPLATE.STATISTICS());
        } catch (error) {
            console.error(error);
        }

        return savedAnswer;
    }

    static async createNewSkill(orgId: string, skill: Skill): Promise<SkillModel> {
        return CompassDataController.saveSkill(orgId, skill);
    }

    static async createOrUpdateSkill(orgId: string, skill: SkillModel): Promise<SkillModel> {
        return CompassDataController.createOrUpdateSkill(orgId, skill);
    }

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

        // Get skills that the target user has
        const targetSkills = await this.getUserSkillIds(orgId, aboutUserId);

        const aboutUserSkills = await CompassDataController.getSkillsByIds(orgId, targetSkills);
        const todo = CompassManager.buildUpNewTodoResponse(ownerId, organization.todoSentenceNumber, aboutUserId, aboutUserSkills);
        return CompassDataController.saveCompassTodo(organization.dbName, todo);
    }

    async autoGenerateTodosForOrganization(org: OrganizationModel, random: Function) {
        const {dbName} = org;
        const users = await UserDataController.getOrganizationUsers(dbName);

        if (users.length === 0) {
            return;
        }

        return Promise.all(users.map(async (user) => {
            const userGroups: Group[] = await this.groupDataController.getUserGroups(dbName, user._id);
            const groupsWithTodoRelations = userGroups.filter((group) => group.todoCardRelations.length > 0);

            if (groupsWithTodoRelations.length > 0) {
                // Select a group from owner user's group list
                const randomGroup = random(groupsWithTodoRelations);
                // Possible target groups
                const groupsToPickUserFrom = await this.groupDataController.getGroupsByIds(dbName, randomGroup.todoCardRelations);
                // Select a target group from the list
                const randomTargetGroup = random(groupsToPickUserFrom);
                // Filter owner from the list
                const usersToPickFrom = randomTargetGroup.users.filter((element: any) => user._id.toString() !== element);

                if (usersToPickFrom.length > 0) {
                    // Random target user
                    const randomAboutUserId = random(usersToPickFrom);
                    // Get skills that the target user has
                    const targetSkills = await this.getUserSkillIds(dbName, randomAboutUserId);
                    // Fetch skills from DB
                    const skills = await CompassDataController.getSkillsByIds(dbName, targetSkills);
                    // Build CompassTODO object
                    const todo = CompassManager.buildUpNewTodoResponse(user._id, org.todoSentenceNumber, randomAboutUserId, skills);
                    // Save built object
                    await CompassDataController.saveCompassTodo(dbName, todo);
                    // Send notification
                    UserDataController.getUserById(randomAboutUserId)
                        .then((aboutUser) => this.notificationManager.sendNotificationById(user._id, TEMPLATE.COMPASS(aboutUser.firstName)))
                        .catch(console.error);

                    return todo;
                }
            }
        })).then((todos) => todos.filter((t) => t));
    }

    async getSkills(orgId: string) {
        return CompassDataController.getAllSkills(orgId);
    }

    private async getUserSkillIds(orgId: string, userId: string) {
        const user = await UserDataController.getUserById(userId);
        const organizationGroups = await this.groupDataController.getGroups(orgId);
        const userGroups = organizationGroups.filter(
            (group: GroupModel) => group.users.indexOf(user._id.toString()) !== -1);
        let skillCollectionFromGroups: string[] = [];
        for (const group of userGroups) {
            skillCollectionFromGroups = skillCollectionFromGroups.concat(group.skills);
        }
        return Array.from(new Set(skillCollectionFromGroups)); // Create a new array without duplicates
    }

    async getStatistics(orgId: string, userId: string) {
        const userGroups: Group[] = await this.groupDataController.getUserGroups(orgId, userId);
        const statistics = await StatisticsManager.getStatistics(orgId, userId, userGroups);
        await StatisticsDataController.saveOrUpdateStatistics(orgId, statistics);
        const savedStatistics = await StatisticsDataController.getStatisticsByUserId(orgId, userId);

        const userSkills = await this.getUserSkillIds(orgId, userId);
        const filteredStatistics = await this.filterStatistics(userSkills, savedStatistics);

        return await Promise.all(filteredStatistics.skillScores.map(async (skillScore: any) => {
            skillScore.skill = await CompassDataController.getSkillById(orgId, skillScore.skill);
            return skillScore;
        }));
    }

    filterStatistics(userSkills: string[], statistics: CompassStatisticsModel): CompassStatisticsModel {
        statistics.skillScores = statistics.skillScores.filter((skillScore: any) => userSkills.indexOf(skillScore.skill) !== -1);
        return statistics;
    }

    async generateTodo(orgId: string) {
        let organization = await this.organizationDataController.getOrganizationByDbName(orgId);
        return this.autoGenerateTodosForOrganization(organization, getRandomItem)
            .then((todos) => (
                {
                    "message": todos && todos.length > 0
                        ? "TODOs were generated successfully"
                        : "No TODO was generated"
                }
            ))
    }
}