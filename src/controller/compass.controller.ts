import OrganizationDataController from "../data/datacontroller/organization.datacontroller";
import UserDataController from "../data/datacontroller/user.datacontroller";
import CompassDataController from "../data/datacontroller/compass.datacontroller";
import * as lodash from 'lodash';
import Organization from "../data/models/organization/organization.model";
import Skill from "../data/models/organization/compass/skill.model";
import { UserModel } from "../data/database/schema/common/user.schema";

export default class CompassController {

    public generateTodo(req: any, res: any, next: Function) {
        const data = req.body;
        OrganizationDataController.getOrganizationByDbName(req.params.orgId)
            .then(CompassController.checkOrganization)

            .then((organization) => Promise.all([
                organization,
                CompassController.getAboutUser(organization.dbName, data.recipientId)]))

            .then(([organization, aboutUser]) => Promise.all([
                organization,
                CompassController.checkAboutUser(aboutUser),
                CompassDataController.getAllSkills(organization.dbName)]))

            .then(([organization, aboutUser, skills]) => Promise.all([
                organization,
                CompassController.buildUpNewTodoResponse(req.user._id, data.senderId, organization, aboutUser, skills)]))

            .then(([organization, newTodo]) => CompassDataController.saveCompassTodo(organization.dbName, newTodo))
            .then((savedCompass: any) => res.send(savedCompass))
            .catch((err) => res.status(400).json({error: err.message}));
    }

    public static checkOrganization(organization: Organization): Promise<any> {
        if (!organization) {
            throw new Error('Organization nonexistent!');
        }
        return Promise.resolve(organization);
    }

    public static checkAboutUser(user: UserModel) {
        if (!user) {
            throw new Error('User could not be found');
        }
        return Promise.resolve(user);
    }

    public static getAboutUser(orgId: string, userId: string): Promise<any> {
        return UserDataController.getUserById(orgId, userId, ['_id', 'firstName', 'lastName']);
    }

    public static buildUpNewTodoResponse(senderId: string, recipientId: string, organization: Organization, aboutUser: UserModel, skills: Skill[])
    :Promise<any> {
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

        const newData = {
            aboutUser: aboutUser._id,
            recipientId: recipientId,
            sender: senderId,
            message: 'What do you think about this common? Would be cool if you could answer some things about the common',
            sentences: sentencesToBeAnswered
        };

        return Promise.resolve(newData);
    }

}