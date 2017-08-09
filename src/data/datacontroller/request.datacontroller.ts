import BaseDataController from "./base.datacontroller";
import { RequestCollection, RequestModel } from "../database/schema/request.schema";
import { UserCollection } from "../database/schema/user.schema";
import DatabaseManager from "../database/database.manager";
import { Model, Types } from 'mongoose';
import Request from "../models/request.model";
import { User } from "../models/user.model";

export default class RequestDataController extends BaseDataController<RequestModel> {

    constructor(databaseManager: DatabaseManager) {
        super(databaseManager, RequestCollection);
    }

    public saveNewRequest(organizationId: string, request: Object): Promise<Request> {
        return new Promise<Request>((resolve, reject) => {
            const requestModel: Model<RequestModel> = RequestCollection(organizationId);
            new requestModel(request).save((error: Error, request: Request) => error ? reject(error) : resolve(request));
        });
    }

    public getAllRequests(organizationId: string, userId: string): Promise<Request[]> {
        return new Promise<Request[]>((resolve, reject) => {
            const query: any = {$or: [{senderId: userId}, {recipientId: {$in: [userId]}}]};
            this.queryRequests(organizationId, query, reject, resolve);
        });
    }

    public getSenderRequests(organizationId: string, userId: string): Promise<Request[]> {
        return new Promise((resolve, reject) => {
            const query = {senderId: userId};
            this.queryRequests(organizationId, query, reject, resolve);
        });
    }

    public getRecipientRequests(organizationId: string, userId: string): Promise<Request[]> {
        return new Promise((resolve, reject) => {
            const query = {recipientId: {$in: [userId]}};
            this.queryRequests(organizationId, query, reject, resolve);
        });
    }

    public getSpecificRequestForUser(organizationId: string, userId: string, requestId: string): Promise<Request> {
        return new Promise((resolve, reject) => {
            const query = {$and: [{_id: new Types.ObjectId(requestId)}, {$or: [{senderId: userId}, {recipientId: {$in: [userId]}}]}]};
            RequestCollection(organizationId).findOne(query, (error: Error, request: Request) => error ? reject(error) : resolve(request));
        });
    }

    public getRecipientUsersFromRequest(organizationId: string, userId: string, requestId: string): Promise<User[]> {
        return new Promise((resolve, reject) => {
            this.getSpecificRequestForUser(organizationId, userId, requestId)
                .then(request => {
                    const arrayOfIds = request.recipientId.map((idStr) => Types.ObjectId(idStr));
                    const userQuery = {_id: {$in: arrayOfIds}};
                    UserCollection().find(userQuery, (error: Error, users: User[]) => error ? reject(error) : resolve(users))
                })
                .catch(reason => reject(reason))
        });
    }

    private queryRequests(dbName: string, query: any, reject: Function, resolve: Function) {
        RequestCollection(dbName).find(query, (error: Error, feedbacks: Request[]) => error ? reject(error) : resolve(feedbacks));
    }

}