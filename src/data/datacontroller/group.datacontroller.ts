import { GroupCollection } from "../database/schema/group.schema";
import Group from "../models/group.model";

interface GroupDataController {
    createGroup: (orgId: string, group: Group) => Promise<any>
    getGroupById: (orgId: string, groupId: string) => Promise<any>
    getUserGroups: (orgId: string, userId: string) => Promise<any>
}

const groupDataController: GroupDataController = {

    createGroup: function (orgId: string, group: Group): Promise<any> {
        return new (GroupCollection(orgId))(group).save();
    },

    getGroupById: function (orgId: string, groupId: string): Promise<any> {
        return GroupCollection(orgId).findById(groupId).lean().exec();
    },

    getUserGroups: function (orgId: string, userId: string): Promise<any> {
        return GroupCollection(orgId).find({users: {$in: [userId]}}).lean().exec();
    }

};

export { groupDataController, GroupDataController}