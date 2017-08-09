import { ResetPasswordCollection, ResetPasswordModel } from "../database/schema/resetpassword.schema";
import BaseDataController from "./base.datacontroller";
import ResetPassword from "../models/resetpassword.model";
import DatabaseManager from "../database/database.manager";

export default class ResetPasswordDataController extends BaseDataController<ResetPasswordModel> {

    constructor(databaseManager: DatabaseManager) {
        super(databaseManager, ResetPasswordCollection);
    }

    public saveResetPassword(resetPwd: ResetPassword): Promise<ResetPassword> {
        return new Promise((resolve, reject) => {
            const resetPasswordModel = ResetPasswordCollection();
            new resetPasswordModel(resetPwd).save((error, resetPwd) => error ? reject(error) : resolve(resetPwd));
        });
    }

}