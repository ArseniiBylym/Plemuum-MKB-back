import { GroupCollection } from "../database/schema/group.schema";
import Group from "../models/group.model";

const GroupDataController = {

    createGroup: (orgId: string, group: Group): Promise<any> => {
        return new (GroupCollection(orgId))(group).save();
    },

    getGroupById: (orgId: string, groupId: string): Promise<any> => {
        return GroupCollection(orgId).findById(groupId).lean().exec();
    },

    getUserGroups: (orgId: string, userId: string): Promise<any> => {
        return GroupCollection(orgId).find({users: {$in: [userId]}}).lean().exec();
    },

    putUserIntoGroup: (orgId: string, userId: string, groupId: string): Promise<any> => {
        return GroupCollection(orgId).findById(groupId).lean().exec()
            .then((group: any) => {
                if (group.users.includes(userId)) {
                    throw new Error("User is already part of this group");
                } else {
                    return GroupCollection(orgId).update({_id: groupId}, {$push: {users: userId}}).lean().exec();
                }
            });
    },

    removeUserFromGroup: (orgId: string, userId: string, groupId: string): Promise<any> => {
        return GroupCollection(orgId).findById(groupId).lean().exec()
            .then((group: any) => {
                if (group.users.includes(userId)) {
                    return GroupCollection(orgId).update({_id: groupId}, {$pull: {users: userId}}).lean().exec();
                } else {
                    throw new Error("User is not part of this group");
                }
            });
    }

};

export default GroupDataController