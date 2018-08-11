import {GroupCollection, GroupModel} from "../database/schema/organization/group.schema";
import { Group } from "../models/organization/group.model";
import { ErrorType, PlenuumError } from "../../util/errorhandler";

export class GroupDataController {
    public createGroup(orgId: string, group: Group): Promise<any> {
            return new (GroupCollection(orgId))(group).save();
    }

    public getGroups(orgId: string): Promise<GroupModel[]> {
        return GroupCollection(orgId).find({}).lean().exec() as Promise<GroupModel[]>;
    }

    public getGroupById(orgId: string, groupId: string): Promise<Group> {
        return GroupCollection(orgId).findById(groupId).lean().exec() as Promise<Group>;        
    }

    public getGroupsByIds(orgId: string, groupIds: string[]): Promise<Group[]> {
        return GroupCollection(orgId).find({_id: {$in: groupIds}}).lean().exec() as Promise<Group[]>;
    }

    public getUserGroups(orgId: string, userId: string): Promise<GroupModel[]> {
        return GroupCollection(orgId).find({users: {$in: [userId]}}).lean().exec() as Promise<GroupModel[]>;
    }

    public putUserIntoGroup(orgId: string, userId: string, groupId: string): Promise<any> {
        return GroupCollection(orgId).findById(groupId).lean().exec()
        .then((group: any) => {
            if (group.users.includes(userId)) {
                throw new PlenuumError("User is already part of this group", ErrorType.NOT_ALLOWED);
            } else {
                return GroupCollection(orgId).update({_id: groupId}, {$push: {users: userId}}).lean().exec();
            }
        });
    }
    public removeUserFromGroup(orgId: string, userId: string, groupId: string): Promise<any> {
        return GroupCollection(orgId).findById(groupId).lean().exec()
        .then((group: any) => {
            if (!group.users.includes(userId)) {
                throw new PlenuumError("User is not part of this group", ErrorType.NOT_ALLOWED);
            }
            return GroupCollection(orgId).update({_id: groupId}, {$pull: {users: userId}}).lean().exec();
        });

    }
    public updateGroup(orgId: string, groupId: string, group: Group): Promise<any> {
        // TODO: maybe investigate this and get rid of this hack it later.
        if ((group as any)._id) {
            delete (group as any)._id;
        }

        return GroupCollection(orgId).update({_id: groupId}, group).exec()
            .then((result) => {
                if (result.nModified === 0) {
                    throw new PlenuumError('Group was not found', ErrorType.NOT_FOUND);
                }
            });        
    }
}

export const getGroupDataController = () => new GroupDataController();