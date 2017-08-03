import BaseDataController from "./base.datacontroller";
import { getDatabaseModel, RequestModel } from "../database/schema/request.schema";
import DatabaseManager from "../database/database.manager";
import { Model } from 'mongoose';

export default class RequestDataController extends BaseDataController<RequestModel> {

    constructor(databaseManager: DatabaseManager) {
        super(databaseManager, getDatabaseModel);
    }

    public saveNewRequest(organizationId: string, request: Object): Promise<Request> {
        return new Promise<Request>((resolve, reject) => {
            const newRequest: Model<RequestModel> = getDatabaseModel(this.databaseManager.getConnection(), organizationId);
            new newRequest(request).save((error: Error, request: Request) => error ? reject(error) : resolve(request));
        });
    }

}