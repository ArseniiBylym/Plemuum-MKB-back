import { GroupDataController } from "../../data/datacontroller/group.datacontroller";
import { GroupModel } from "../../data/database/schema/organization/group.schema";
import { Group } from "../../data/models/organization/group.model";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import CompassDataController from "../../data/datacontroller/compass.datacontroller";
import { ErrorType, PlenuumError } from "../../util/errorhandler";
import { UserModel } from "../../data/database/schema/common/user.schema";
import * as  _ from "lodash"
export default class GroupInteractor {

    groupDataController: GroupDataController;

    constructor(groupDataController: GroupDataController) {
        this.groupDataController = groupDataController;
    }

    async getGroups(orgId: string,) {
        const allGroups: GroupModel[] = await this.groupDataController.getGroups(orgId);
        return Promise.all(allGroups.map(async (group: any) => {
            group.users = await UserDataController.getUserByIdsFromOrg(orgId, group.users);

            group.skills = await CompassDataController.getSkillsByIds(orgId, group.skills);

            return group;
        }))
    };

    async createGroup(orgId: string, group: any) {
        return this.groupDataController.createGroup(orgId, group)
    }

    async getGroupById(orgId: string, groupId: string): Promise<Group> {
        const group = await this.groupDataController.getGroupById(orgId, groupId);
        if (!group) {
            throw new PlenuumError("Group not found", ErrorType.NOT_FOUND);
        }
        return group;
    }

    async getGroupsByIds(orgId: string, groupIds: string[]): Promise<Group[]> {
        const groups = await this.groupDataController.getGroupsByIds(orgId, groupIds);
        if (!groups) {
            throw new PlenuumError("Group not found", ErrorType.NOT_FOUND);
        }
        return groups;
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

        const answerCardGroups = await this.getGroupsByIds(orgId,answerCardGroupIds);
        let userIds: string[] = [];
        answerCardGroups.forEach((group) => userIds = userIds.concat(group.users));

        const users = await UserDataController.getUserByIdsFromOrg(orgId, userIds);

        return this.filterUserDoubling(users).filter((user : any) => user && user._id.toString() !== userId.toString());
    }

    filterUserDoubling(array: any[]): UserModel[] {
        let result: any[];
        result = _.compact(array);
        result = _.uniqBy(result, (item:any)=> item._id.toString());
        return result;
    };
}