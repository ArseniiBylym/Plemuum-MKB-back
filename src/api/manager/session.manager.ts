import * as tokenManager from "../../service/auth/token.manager";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { ErrorType, PlenuumError } from "../../util/errorhandler";

export default class SessionManager {

    async login(userId: string) {
        const token = tokenManager.generateNewToken(userId, true);
        const user = await UserDataController.getUserByIdWithoutOrgId(userId, true, true);
        return {
            token: token,
            orgIds: user.orgIds
        }
    }

    async logout(userId: string) {
        try {
            await UserDataController.removeToken(userId);
            return {message: "User logged out successfully"}
        } catch (err) {
            throw new PlenuumError("User could not be logged out.", ErrorType.UNKNOWN);
        }
    }

    async checkToken(token: any) {
        const resetToken = await UserDataController.getResetToken(token);
        const now = new Date();
        return (resetToken.token_expiry < now || resetToken.reseted)
            ? {validToken: false, reseted: resetToken.reseted}
            : {validToken: true, reseted: false};
    }
}