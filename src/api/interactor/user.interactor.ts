import UserDataController from "../../data/datacontroller/user.datacontroller";
import { resetPasswordDataController } from "../../data/datacontroller/resetpassword.datacontroller";
import { generateNewTokensForResetPassword } from "../../manager/auth/token.manager";
import { ErrorType, PlenuumError } from "../../util/errorhandler";
import { UserModel } from "../../data/database/schema/common/user.schema";
import config from "../../../config/config";
import { default as getLogger } from "../../util/logger";
import FileManager from "../../manager/file/file.manager";
import EmailManager from "../../manager/email/mail.manager";
import * as crypto from 'crypto';

export default class UserInteractor {

    private emailManager: EmailManager;
    private fileManager: FileManager;

    constructor(emailService: EmailManager, fileManager: FileManager) {
        this.emailManager = emailService;
        this.fileManager = fileManager;
    }

    async updateUser(user: UserModel) {
        const id = user._id;
        delete user._id;
        const updatedUser = await UserDataController.updateUser(id, user);
        if (!updatedUser) {
            throw new PlenuumError("User not found", ErrorType.NOT_FOUND);
        }
        return updatedUser;
    }

    async setPassword(token: string, newPassword: string) {
        const resetedPassword: any = await resetPasswordDataController.getResetPasswordByToken(token);
        if (resetedPassword.token_expiry <= new Date()) {
            throw new PlenuumError("Token expired", ErrorType.FORBIDDEN);
        }

        const {tokenExpired} = generateNewTokensForResetPassword();
        await resetPasswordDataController.updateResetPassword(resetedPassword._id, tokenExpired);

        const updatedUser = await UserDataController.changeUserPasswordByUserId(resetedPassword.userId, newPassword);
        if (!updatedUser) {
            throw new PlenuumError("User not found", ErrorType.NOT_FOUND);
        }
        return {
            successMessage: "Your password was successfully changed. You can now go to Plenuum " +
            "web app and log with new password"
        }
    }

    async resetPassword(email: string, origin: string = '', isWelcome: boolean) {
        const user = await UserDataController.getUserByEmail(email);
        const {token, token_expiry} = UserDataController.generateToken(1);
        const data = {userId: String(user._id), token: token, token_expiry: token_expiry, reseted: false};

        const resetPassword = await resetPasswordDataController.saveResetPassword(data);
        const link = origin + "/set_new_password?token=" + resetPassword.token + "&email="
            + user.email + (isWelcome ? "&welcome=true" : "");
        const resetPasswordToken = resetPassword.token;
        const response = {email: user.email, link: link};

        await this.emailManager.sendResetEmail(user.email, link);
        return {resetPasswordToken: resetPasswordToken, response: response};
    }

    async userRegistrationFromCSV(csvFile: any, orgId: string) {
        return Promise.all((await this.fileManager.convertCSV2UserArray(csvFile)).map(async (user: any) => {
            user.orgIds = [orgId];
            user.password = crypto.randomBytes(16).toString('hex');
            return this.saveUser(user, orgId);
        }))
    }

    async profilePictureUpload(avatar: any, userId: string) {
        const pictureUrl = await this.fileManager.uploadUserPicture(avatar, userId);
        const updatedUser = await UserDataController.setUserPic(userId, pictureUrl);

        if (!updatedUser) {
            throw new PlenuumError("User not found", ErrorType.NOT_FOUND);
        }
        return {avatar: pictureUrl}
    }

    //This should be async
    async saveUser(body: any, orgId: string) {
        body.admin = body.admin && body.admin === 'true';
        const savedUser = await UserDataController.saveUser(body);
        if (!savedUser) {
            throw new PlenuumError("User not saved", ErrorType.VALIDATION);
        }
        this.sendChangePasswordOnWelcome(savedUser, orgId);
        return savedUser;
    }

    sendChangePasswordOnWelcome(user: any, orgIds: string) {
        const origin = config.webappDomain;
        const {email, firstName, _id} = user;
        const {token, token_expiry} = UserDataController.generateToken(1);
        const data = {userId: _id, token: token, token_expiry: token_expiry, reseted: false};
        resetPasswordDataController.saveResetPassword(data)
            .then((response) => {
                let link = origin + "/set_new_password?token="
                    + response.token + "&email=" + email + "&welcome=true&name=" + firstName;
                const mailService = new EmailManager();
                mailService.sendWelcomeEmail(email, firstName, link, orgIds);
            })
            .catch((error) => {
                getLogger().error({
                    type: "error",
                    request: {
                        user: user
                    },
                    message: error,
                    timeStamp: new Date()
                });
            });
    }
}