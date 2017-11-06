import * as tokenManager from "../../service/auth/token.manager";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { ErrorType, PlenuumError } from "../../util/errorhandler";

export default class SessionManager {

    async login(userId: string) {
        return {token: tokenManager.generateNewToken(userId, new Date()),}
    }

    async loginAsAdmin() {
        return {token: tokenManager.generateNewToken("admin", new Date(), true)}
    }

    async checkToken(token: any) {
        const resetToken = await UserDataController.getResetToken(token);
        const now = new Date();
        const test = resetToken.token_expiry > now;
        if (resetToken && !resetToken.reseted && test) {
            return {validToken: true, reseted: false};
        } else {
            throw new PlenuumError("Token is not valid anymore.", ErrorType.NOT_VALID);
        }
    }
}