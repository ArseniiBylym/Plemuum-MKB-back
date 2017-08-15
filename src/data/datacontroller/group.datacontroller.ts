import BaseDataController from "./base.datacontroller";
import { GroupCollection, GroupModel } from "../database/schema/group.schema";
import DatabaseManager from "../database/database.manager";
import Group from "../models/group.model";

export default class GroupDataController extends BaseDataController<GroupModel> {

    constructor(databaseManager: DatabaseManager) {
        super(databaseManager, GroupCollection);
    }

    public createGroup(orgId: string, group: Group): Promise<any> {
        return new (GroupCollection(orgId))(group).save();
    }

    public getGroupById(orgId: string, groupId: string): Promise<any> {
        return GroupCollection(orgId).findById(groupId).lean().exec();
    }

    public getUserGroups(orgId: string, userId: string): Promise<any> {
        return GroupCollection(orgId).find({users: {$in: [userId]}}).lean().exec();
    }

}