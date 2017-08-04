import BaseDataController from "./base.datacontroller";
import { getRequestModel, RequestModel } from "../database/schema/request.schema";
import DatabaseManager from "../database/database.manager";
import { Model, Types} from 'mongoose';
import Request from "../models/request.model";

export default class RequestDataController extends BaseDataController<RequestModel> {

    constructor(databaseManager: DatabaseManager) {
        super(databaseManager, getRequestModel);
    }

    public saveNewRequest(organizationId: string, request: Object): Promise<Request> {
        return new Promise<Request>((resolve, reject) => {
            const newRequest: Model<RequestModel> = getRequestModel(this.databaseManager.getConnection(), organizationId);
            new newRequest(request).save((error: Error, request: Request) => error ? reject(error) : resolve(request));
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
            const newRequest: Model<RequestModel> = getRequestModel(this.databaseManager.getConnection(), organizationId);
            const query = {$and: [{_id: new Types.ObjectId(requestId)}, {$or: [{senderId: userId}, {recipientId: {$in: [userId]}}]}]};
            newRequest.findOne(query, (error: Error, request: Request) => error ? reject(error) : resolve(request));
        });
    }

    private queryRequests(dbName: string, query: any, reject: Function, resolve: Function) {
        const feedbackModel = getRequestModel(this.databaseManager.getConnection(), dbName);
        feedbackModel.find(query, (error: Error, feedbacks: Request[]) => error ? reject(error) : resolve(feedbacks));
    }

}