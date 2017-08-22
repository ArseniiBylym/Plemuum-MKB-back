import OrganizationDataController from "../../data/datacontroller/organization.datacontroller";
import CompassDataController from "../../data/datacontroller/compass.datacontroller";
import Organization from "../../data/models/organization/organization.model";
import { UserModel } from "../../data/database/schema/common/user.schema";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import * as lodash from 'lodash';
import { SkillModel } from "../../data/database/schema/organization/compass/skill.schema";
import CompassAnswer from "../../data/models/organization/compass/compassanswer.model";

export default class CompassManager {

    static async generateTodo(data: any, orgId: string, userId: string): Promise<any> {
        const organization = await OrganizationDataController.getOrganizationByDbName(orgId);
        CompassManager.checkOrganization(organization);

        const aboutUser: UserModel = await CompassManager.getAboutUser(organization.dbName, data.recipientId);
        CompassManager.checkAboutUser(aboutUser);

        const skills: SkillModel[] = await CompassDataController.getAllSkills(organization.dbName);
        const newTodo = CompassManager.buildUpNewTodoResponse(userId, data.senderId, organization, aboutUser, skills);
        return CompassDataController.saveCompassTodo(organization.dbName, newTodo);
    }

    static checkOrganization(organization: Organization): Organization {
        if (!organization) {
            throw new Error('Organization nonexistent!');
        }
        return organization
    }

    static checkAboutUser(user: UserModel): UserModel {
        if (!user) {
            throw new Error('User could not be found');
        }
        return user;
    }

    static getAboutUser(orgId: string, userId: string): Promise<any> {
        return UserDataController.getUserById(orgId, userId, ['_id', 'firstName', 'lastName']);
    }

    static buildUpNewTodoResponse(senderId: string, recipientId: string,
                                  organization: Organization, aboutUser: UserModel, skills: SkillModel[]): any {
        const numberOfSentences = organization.todoSentenceNumber;
        const sentencesToBeAnswered: any[] = [];

        for (let i = 0; i < numberOfSentences; i++) {
            const randomSkill = skills[lodash.random(0, skills.length - 1, false)];
            const randomSentence = randomSkill.sentences[lodash.random(0, randomSkill.sentences.length - 1, false)];
            sentencesToBeAnswered.push({
                sentence: randomSentence,
                skill: randomSkill
            });
            lodash.pull(skills, randomSkill);
        }

        return {
            about: aboutUser._id,
            recipient: recipientId,
            createdBy: senderId,
            questions: sentencesToBeAnswered
        };
    }

    //TODO Update statistics!
    static async answerCompass(orgId: string, answer: CompassAnswer): Promise<CompassAnswer> {
        return CompassDataController.saveCompassAnswer(orgId, answer);
    }


}