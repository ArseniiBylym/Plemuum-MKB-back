import * as tokenManager from "../../service/auth/token.manager";
import { TokenObject } from "../../service/auth/token.manager";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { ErrorType, PlenuumError } from "../../util/errorhandler";

export default class SessionManager {

    async login(userId: string) {
        let tokenObj: TokenObject = tokenManager.generateNewTokenObject();
        const user = await UserDataController.getUserByIdWithoutOrgId(userId);
        const now = new Date();
        if (user && user.token && user.token.token_expiry > now) {
            tokenObj = {
                token: user.token.token,
                tokenExpiry: tokenObj.tokenExpiry
            };
        }
        const updatedUser = await UserDataController.updateUserToken(user._id, tokenObj);
        return {
            token: updatedUser.token.token,
            token_expiry: updatedUser.token.token_expiry,
        }
    }

    async logout(userId: string) {
        try {
            const result = await UserDataController.removeToken(userId);
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