import ResetPassword from "../models/common/resetpassword.model";
import { ResetPasswordCollection } from "../database/schema/common/resetpassword.schema";


interface ResetPasswordDataController {
    saveResetPassword: (resetPwd: ResetPassword) => Promise<any>
    getResetPasswordByToken: (token: string) => Promise<any>
    updateResetPassword: (id: string, tokenExpired: Date) => Promise<any>
}

const resetPasswordDataController: ResetPasswordDataController = {

    saveResetPassword(resetPwd: ResetPassword): Promise<any> {
        return new (ResetPasswordCollection())(resetPwd).save();
    },

    getResetPasswordByToken(token: string): Promise<any> {
        return ResetPasswordCollection().findOne({token: token}).lean().exec();
    },

    updateResetPassword(id: string, tokenExpired: Date): Promise<any> {
        return ResetPasswordCollection().findByIdAndUpdate(id, {$set: {reseted: true, token_expiry: tokenExpired}},
            {"new": true}).lean().exec();
    }
};

export { resetPasswordDataController, ResetPasswordDataController}