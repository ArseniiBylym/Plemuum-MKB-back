import OrganizationDataController from "../data/datacontroller/organization.datacontroller";
import UserDataController from "../data/datacontroller/user.datacontroller";
import CompassDataController from "../data/datacontroller/compass.datacontroller";
import * as lodash from 'lodash';
import Organization from "../data/models/organization/organization.model";
import Skill from "../data/models/organization/compass/skill.model";
import { UserModel } from "../data/database/schema/common/user.schema";

export default class CompassController {

    public generateTodoController(req: any, res: any, next: Function) {
        CompassController.generateTodo(req.body, req.params.orgId, req.user._id)
            .then(savedTodo => res.send(savedTodo))
            .catch((err) => res.status(400).json({error: err.message}));
    }

    public static async generateTodo(data: any, orgId: string, userId: string): Promise<any> {
        const organization = await OrganizationDataController.getOrganizationByDbName(orgId);
        CompassController.checkOrganization(organization);
        const aboutUser: any = await CompassController.getAboutUser(organization.dbName, data.recipientId);
        CompassController.checkAboutUser(aboutUser);
        const skills: Skill[] = await CompassDataController.getAllSkills(organization.dbName);
        const newTodo = CompassController.buildUpNewTodoResponse(userId, data.senderId, organization, aboutUser, skills);
        return CompassDataController.saveCompassTodo(organization.dbName, newTodo);
    }

    public static checkOrganization(organization: Organization): Organization {
        if (!organization) {
            throw new Error('Organization nonexistent!');
        }
        return organization
    }

    public static checkAboutUser(user: UserModel): UserModel {
        if (!user) {
            throw new Error('User could not be found');
        }
        return user;
    }

    public static getAboutUser(orgId: string, userId: string): Promise<any> {
        return UserDataController.getUserById(orgId, userId, ['_id', 'firstName', 'lastName']);
    }

    public static buildUpNewTodoResponse(senderId: string, recipientId: string, organization: Organization, aboutUser:
        UserModel, skills: Skill[]): any {
        const numberOfSentences = organization.todoSentenceNumber;
        const sentencesToBeAnswered: any[] = [];

        for (let i = 0; i < numberOfSentences; i++) {
            const randomSkill = skills[lodash.random(0, skills.length - 1, false)];
            const randomSentence = randomSkill.sentences[lodash.random(0, randomSkill.sentences.length - 1, false)];
            sentencesToBeAnswered.push({
                message: randomSentence.message,
                skillName: randomSkill.name
            });
            lodash.pull(skills, randomSkill);
        }

        return {
            aboutUser: aboutUser._id,
            recipientId: recipientId,
            sender: senderId,
            message: 'What do you think about this common? Would be cool if you could answer some things about the common',
            sentences: sentencesToBeAnswered
        };
    }

}