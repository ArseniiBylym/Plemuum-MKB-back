import BaseDataController from "./base.datacontroller";
import { getRequestModel, RequestModel } from "../database/schema/request.schema";
import DatabaseManager from "../database/database.manager";
import { Model } from 'mongoose';

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
            const newRequest: Model<RequestModel> = getRequestModel(this.databaseManager.getConnection(), organizationId);
            const query: any = {$or: [{senderId: userId}, {recipientId: {$in: [userId]}}]};
            newRequest.find(query, (error: Error, requests: Request[]) => error ? reject(error) : resolve(requests));
        });
    }

}