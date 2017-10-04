import { GroupDataController } from "../../data/datacontroller/group.datacontroller";
import { GroupModel } from "../../data/database/schema/organization/group.schema";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import CompassDataController from "../../data/datacontroller/compass.datacontroller";
import { ErrorType, PlenuumError } from "../../util/errorhandler";

export default class GroupManager {

    groupDataController: GroupDataController;

    constructor(groupDataController: GroupDataController) {
        this.groupDataController = groupDataController;
    }

    async getGroups(orgId: string,) {
        const allGroups: GroupModel[] = await this.groupDataController.getGroups(orgId);
        return Promise.all(allGroups.map(async (group: any) => {

            group.users = await Promise.all(group.users.map((userId: string) =>
                UserDataController.getUserById(orgId, userId)));

            group.skills = await Promise.all(
                group.skills.map((skillId: string) => CompassDataController.getSkillById(orgId, skillId)));

            return group;
        }));
    };

    async createGroup(orgId: string, group: any) {
        return this.groupDataController.createGroup(orgId, group)
    }

    async getGroupById(orgId: string, groupId: string) {
        const group = await this.groupDataController.getGroupById(orgId, groupId);
        if (!group) {
            throw new PlenuumError("Group not found", ErrorType.NOT_FOUND);
        }
        return group;
    }

    async getUserGroups(orgId: string, userId: string) {
        return this.groupDataController.getUserGroups(orgId, userId)
    }

    async putUserIntoGroup(orgId: string, userId: string, groupId: string) {
        return this.groupDataController.putUserIntoGroup(orgId, userId, groupId)
            .then((group: GroupModel) => ({success: "User has been added"}))
    }

    async removeUserFromGroup(orgId: string, userId: string, groupId: string) {
        return this.groupDataController.removeUserFromGroup(orgId, userId, groupId)
            .then((group: GroupModel) => ({success: "User has been removed"}))
    }

    async updateGroup(orgId: string, group: any) {
        return this.groupDataController.updateGroup(orgId, group._id, group)
            .then((group: GroupModel) => ({success: "Group has been updated"}))
    }

    async getAnswerCardUsers(orgId: string, userId: string) {
        const userGroups = await this.getUserGroups(orgId, userId);

        let answerCardGroupIds: string[] = [];
        userGroups.forEach((group) => answerCardGroupIds = answerCardGroupIds.concat(group.answerCardRelations));

        const answerCardGroups = await Promise.all(answerCardGroupIds.map(async (groupId) => await this.getGroupById(orgId, groupId)));
        let userIds: string[] = [];
        answerCardGroups.forEach((group) => userIds = userIds.concat(group.users));

        return Promise.all(userIds.map(async (userId) => await UserDataController.getUserById(orgId, userId)));
    }
}