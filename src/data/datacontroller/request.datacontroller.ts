import { RequestCollection } from "../database/schema/organization/request.schema";
import { Model, Types } from 'mongoose';
import { UserCollection } from "../database/schema/common/user.schema";
import UserDataController from "./user.datacontroller";


interface RequestDataController {
    saveNewRequest: (organizationId: string, request: Object) => Promise<any>
    getAllRequests: (organizationId: string, userId: string) => Promise<any>
    getSenderRequests: (organizationId: string, userId: string) => Promise<any>
    getRecipientRequests: (organizationId: string, userId: string) => Promise<any>
    getSpecificRequestForUser: (organizationId: string, userId: string, requestId: string) => Promise<any>
    getRecipientUsersFromRequest: (organizationId: string, userId: string, requestId: string) => Promise<any>
}

const requestDataController: RequestDataController = {

    saveNewRequest(organizationId: string, request: Object): Promise<any> {
        return new (RequestCollection(organizationId))(request).save();
    },

    getAllRequests(organizationId: string, userId: string): Promise<any> {
        return RequestCollection(organizationId).find({$or: [{senderId: userId}, {recipientId: {$in: [userId]}}]}).lean().exec();
    },

    getSenderRequests(organizationId: string, userId: string): Promise<any> {
        return RequestCollection(organizationId).find({senderId: userId}).lean().exec();
    },

    getRecipientRequests(organizationId: string, userId: string): Promise<any> {
        return RequestCollection(organizationId).find({recipientId: {$in: [userId]}}).lean().exec();
    },

    getSpecificRequestForUser(organizationId: string, userId: string, requestId: string): Promise<any> {
        return RequestCollection(organizationId).findOne({
            $and: [{_id: new Types.ObjectId(requestId)}, {$or: [{senderId: userId}, {recipientId: {$in: [userId]}}]}]
        }).lean().exec();
    },

    getRecipientUsersFromRequest(organizationId: string, userId: string, requestId: string): Promise<any> {
        return this.getSpecificRequestForUser(organizationId, userId, requestId)
            .then(request => {
                const arrayOfIds = request.recipientId.map((idStr: any) => Types.ObjectId(idStr));
                return UserDataController.getUsersByIds(organizationId, arrayOfIds);
            })
    }
};

export { requestDataController, RequestDataController }