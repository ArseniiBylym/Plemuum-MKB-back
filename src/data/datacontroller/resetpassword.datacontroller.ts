import { getResetPasswordModel, ResetPasswordModel } from "../database/schema/resetpassword.schema";
import BaseDataController from "./base.datacontroller";
import ResetPassword from "../models/resetpassword.model";
import DatabaseManager from "../database/database.manager";
import { getDatabaseManager } from "../../factory/database.factory";

export default class ResetPasswordDataController extends BaseDataController<ResetPasswordModel> {

    constructor(databaseManager: DatabaseManager) {
        super(databaseManager, getResetPasswordModel);
    }

    public saveResetPassword(resetPwd: ResetPassword): Promise<ResetPassword> {
        return new Promise((resolve, reject) => {
            const resetPasswordModel = getResetPasswordModel(getDatabaseManager().getConnection());
            new resetPasswordModel(resetPwd).save((error, resetPwd) => error ? reject(error) : resolve(resetPwd));
        });
    }

}