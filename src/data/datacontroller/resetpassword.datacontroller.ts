import { ResetPasswordCollection } from "../database/schema/resetpassword.schema";
import ResetPassword from "../models/resetpassword.model";

export default class ResetPasswordDataController {

    public saveResetPassword(resetPwd: ResetPassword): Promise<any> {
        return new (ResetPasswordCollection())(resetPwd).save();
    }

    public getResetPasswordByToken(token: string): Promise<any> {
        return ResetPasswordCollection().findOne({token: token}).lean().exec();
    }

    public updateResetPassword(id: string, tokenExpired: Date,): Promise<any> {
        return ResetPasswordCollection().findByIdAndUpdate(id, {$set: {reseted: true, token_expiry: tokenExpired}},
            {"new": true}).lean().exec();
    }
}