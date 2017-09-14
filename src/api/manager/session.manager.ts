import { User } from "../../data/models/common/user.model";
import { TokenObject } from "../../service/auth/token.manager";
import * as tokenManager from "../../service/auth/token.manager";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { UserModel } from "../../data/database/schema/common/user.schema";
import { PlenuumError, ErrorType } from "../../util/errorhandler";

export default class SessionManager {

    async login(userId: string) {
        let tokenObj: TokenObject = tokenManager.generateNewTokenObject();
        const user = await UserDataController.getUserByIdWithoutOrgId(userId)
        const now = new Date();
        if (user && user.token && user.token.token_expiry > now) {
            tokenObj = {
                token: user.token.token,
                tokenExpiry: tokenObj.tokenExpiry
            };
        }
        const updatedUser = await UserDataController.updateUserToken(user._id, tokenObj);
        return {
            user: {
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                pictureUrl: updatedUser.pictureUrl
            },
            token: updatedUser.token.token,
            token_expiry: updatedUser.token.token_expiry,
            orgIds: updatedUser.orgIds
        }
    }

    async logout(userId: string) {
        try {
            const result = await UserDataController.removeToken(userId);
            return { message: "User Logged out successfully!" }
        } catch (err) {
            throw new PlenuumError("User could not be logged out.", ErrorType.UNKNOWN);
        }
    }

    async checkToken(token: any) {
        const resetToken = await UserDataController.getResetToken(token);
        const now = new Date();
        return (resetToken.token_expiry < now || resetToken.reseted)
            ? { validToken: false, reseted: resetToken.reseted }
            : { validToken: true, reseted: false };
    }
}