import * as tokenManager from "../../manager/auth/token.manager";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { ErrorType, PlenuumError } from "../../util/errorhandler";

export default class SessionInteractor {

    async login(userId: string) {
        const currentDate = new Date();
        const accessToken = tokenManager.generateNewToken(userId, currentDate);
        const refreshToken = tokenManager.generateAndSaveNewRefreshToken(userId, accessToken, currentDate);
        return {token: accessToken, refreshToken: refreshToken}
    }

    async loginAsAdmin() {
        const currentDate = new Date();
        const accessToken = tokenManager.generateNewToken("admin", currentDate, true);
        const refreshToken = tokenManager.generateAndSaveNewRefreshToken("admin", accessToken, currentDate);
        return {token: accessToken, refreshToken: refreshToken}
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