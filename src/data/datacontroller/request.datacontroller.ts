import { RequestCollection } from "../database/schema/request.schema";
import { UserCollection } from "../database/schema/user.schema";
import { Model, Types } from 'mongoose';

export default class RequestDataController {

    public saveNewRequest(organizationId: string, request: Object): Promise<any> {
        return new (RequestCollection(organizationId))(request).save();
    }

    public getAllRequests(organizationId: string, userId: string): Promise<any> {
        return RequestCollection(organizationId).find({$or: [{senderId: userId}, {recipientId: {$in: [userId]}}]}).lean().exec();
    }

    public getSenderRequests(organizationId: string, userId: string): Promise<any> {
        return RequestCollection(organizationId).find({senderId: userId}).lean().exec();
    }

    public getRecipientRequests(organizationId: string, userId: string): Promise<any> {
        return RequestCollection(organizationId).find({recipientId: {$in: [userId]}}).lean().exec();
    }

    public getSpecificRequestForUser(organizationId: string, userId: string, requestId: string): Promise<any> {
        return RequestCollection(organizationId).findOne({
            $and: [{_id: new Types.ObjectId(requestId)}, {$or: [{senderId: userId}, {recipientId: {$in: [userId]}}]}]
        }).lean().exec();
    }

    public getRecipientUsersFromRequest(organizationId: string, userId: string, requestId: string): Promise<any> {
        return this.getSpecificRequestForUser(organizationId, userId, requestId)
            .then(request => {
                const arrayOfIds = request.recipientId.map((idStr: any) => Types.ObjectId(idStr));
                return UserCollection().find({_id: {$in: arrayOfIds}}).lean().exec();
            })
    }
}