import { GroupCollection, GroupModel } from "../database/schema/organization/group.schema";
import Group from "../models/organization/group.model";

export interface GroupDataController {
    createGroup: ((orgId: string, group: Group) => Promise<any>);
    getGroups: ((orgId: string) => Promise<GroupModel[]>);
    getGroupById: ((orgId: string, groupId: string) => Promise<any>);
    getUserGroups: ((orgId: string, userId: string) => Promise<GroupModel[]>);
    putUserIntoGroup: ((orgId: string, userId: string, groupId: string) => Promise<any>);
    removeUserFromGroup: ((orgId: string, userId: string, groupId: string) => Promise<any>);
    updateGroup: ((orgId: string, groupId: string, group: Group) => Promise<any>)
}

const getGroupDataController = () => {
    return {
        createGroup: (orgId: string, group: Group): Promise<any> => {
            return new (GroupCollection(orgId))(group).save();
        },

        getGroups: (orgId: string): Promise<Group[]> => {
            return GroupCollection(orgId).find({}).lean().exec() as Promise<Group[]>;
        },

        getGroupById: (orgId: string, groupId: string): Promise<any> => {
            return GroupCollection(orgId).findById(groupId).lean().exec();
        },

        getUserGroups: (orgId: string, userId: string): Promise<GroupModel[]> => {
            return GroupCollection(orgId).find({users: {$in: [userId]}}).lean().exec() as Promise<GroupModel[]>;
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
        },

        updateGroup: (orgId: string, groupId: string, group: Group): Promise<any> => {
            return GroupCollection(orgId).update({_id: groupId}, group).exec()
                .then((result) => {
                    if (result.nModified === 0) {
                        throw new Error('Group was not found');
                    }
                });
        }
    }
};

export { getGroupDataController }