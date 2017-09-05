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

export default class CompassManager {

    groupDataController: GroupDataController;
    organizationDataController: OrganizationDataController;

    constructor(groupDataController: GroupDataController, organizationDataController: OrganizationDataController) {
        this.groupDataController = groupDataController;
        this.organizationDataController = organizationDataController;
    }

    async answerCard(aboutUserId: string, ownerId: string, orgId: string) {
        const organization = await this.organizationDataController.getOrganizationByDbName(orgId);
        CompassManager.checkOrganization(organization);

        const aboutUser: UserModel = await CompassManager.getAboutUser(organization.dbName, aboutUserId);
        CompassManager.checkAboutUser(aboutUser);

        const aboutUserGroups = await this.groupDataController.getUserGroups(orgId, aboutUserId);
        const senderUserGroups = await this.groupDataController.getUserGroups(orgId, ownerId);

        const answerGroups: Group[] = [];
        const answerCardRelationGroups = senderUserGroups.forEach(
            (senderGroup) => senderGroup.answerCardRelations.forEach((relationGroupId) => {
                const found = aboutUserGroups.find((aboutGroup) => aboutGroup._id.toString() === relationGroupId);
                if (found) {
                    answerGroups.push(found);
                }
            }));

        CompassManager.checkAnswerCardRelation(answerGroups);

        let answerSkillIds: string[] = [];
        answerGroups.forEach((group) => answerSkillIds = answerSkillIds.concat(group.skills));
        const aboutUserSkills = await CompassDataController.getSkillsByIds(orgId, answerSkillIds);
        return CompassManager.buildUpNewTodoResponse(ownerId, organization, aboutUser, aboutUserSkills);
    }

    async autoGenerateTodo(orgId: string) {
        const organizationGroups = await this.groupDataController.getGroups(orgId);
        const groupsWithTodoRelations = organizationGroups.filter((group) => group.todoCardRelations.length > 0);

        // CompassDataController.saveCompassTodo(organization.dbName, newTodo);

        return groupsWithTodoRelations;
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
        return UserDataController.getUserById(orgId, userId, ['_id', 'firstName', 'lastName']);
    }

    static buildUpNewTodoResponse(ownerId: string, organization: Organization, aboutUser: UserModel, skills: SkillModel[]): any {
        let numberOfSentences = organization.todoSentenceNumber;
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
            about: aboutUser._id,
            owner: ownerId,
            questions: sentencesToBeAnswered
        };
    }

    static async answerCompass(orgId: string, answer: CompassAnswer): Promise<CompassAnswer> {
        const savedAnswer = await CompassDataController.saveCompassAnswer(orgId, answer);
        const statistics = await StatisticsManager.createOrUpdateStatistics(orgId, answer);
        await StatisticsDataController.saveOrUpdateStatistics(orgId, statistics);
        return savedAnswer;
    }

    static async createNewSkill(orgId: string, skill: Skill): Promise<SkillModel> {
        return CompassDataController.saveSkill(orgId, skill);
    }

    static async updateSkill(orgId: string, skill: SkillModel): Promise<SkillModel> {
        await CompassDataController.updateSkill(orgId, skill);
        return CompassDataController.getSkillById(orgId, skill._id);
    }

    async getStatistics(orgId: string, userId: string) {
        const userGroups: Group[] = await this.groupDataController.getUserGroups(orgId, userId);
        const statistics = await StatisticsManager.getStatistics(orgId, userId, userGroups);
        await StatisticsDataController.saveOrUpdateStatistics(orgId, statistics);
        return await StatisticsDataController.getStatisticsByUserId(orgId, userId);
    }
}