import * as tokenManager from "../../service/auth/token.manager";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { ErrorType, PlenuumError } from "../../util/errorhandler";

export default class SessionManager {

    async login(userId: string) {
        const isAdmin = (await UserDataController.getUserById(userId, false, true)).admin;
        const token = tokenManager.generateNewToken(userId, isAdmin, new Date());
        return {
            token: token,
        }
    }

    async loginAsAdmin(userId: string) {
        const isAdmin = (await UserDataController.getUserById(userId, false, true)).admin;
        if (!isAdmin) {
            throw new PlenuumError("You are not an admin", ErrorType.FORBIDDEN);
        }
        return {token: tokenManager.generateNewToken(userId, isAdmin, new Date())}
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
        const test = resetToken.token_expiry > now;
        if (resetToken && !resetToken.reseted && test){
            return { validToken: true, reseted: false };
        }else{
            throw new PlenuumError("Token is not valid anymore.", ErrorType.NOT_VALID);
        }
    }
}