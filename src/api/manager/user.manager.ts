import UserDataController from "../../data/datacontroller/user.datacontroller";
import { resetPasswordDataController } from "../../data/datacontroller/resetpassword.datacontroller";
import EmailService from "../../service/email/mail.service";
import FileTransfer from "../../service/file/filetransfer.service";
import { generateNewTokensForResetPassword } from "../../service/auth/token.manager";
import { ErrorType, PlenuumError } from "../../util/errorhandler";
import { UserModel } from "../../data/database/schema/common/user.schema";
import config from "../../../config/config";
import logger from "../../util/logger";

export default class UserManager {

    private emailService: EmailService;
    private fileTransferService: FileTransfer;

    constructor(emailService: EmailService, fileTransferService: FileTransfer) {
        this.emailService = emailService;
        this.fileTransferService = fileTransferService;
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

        const {tokenExpiry, tokenExpired} = generateNewTokensForResetPassword();
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

        await this.emailService.sendResetEmail(user.email, link);
        return {resetPasswordToken: resetPasswordToken, response: response};
    }

    async profilePictureUpload(avatar: any, userId: string) {
        const pictureUrl = await this.fileTransferService.uploadUserPicture(avatar, userId);
        const updatedUser = await UserDataController.setUserPic(userId, pictureUrl);

        if (!updatedUser) {
            throw new PlenuumError("User not found", ErrorType.NOT_FOUND);
        }
        return {avatar: pictureUrl}
    }

    //This should be async
    async saveUser(body: any, params: any) {
        body.admin = body.admin && body.admin === 'true';
        const savedUser = await UserDataController.saveUser(body);
        if (!savedUser) {
            throw new PlenuumError("User not saved", ErrorType.VALIDATION);
        }
        this.sendChangePasswordOnWelcome(savedUser, body, params);
        return savedUser;
    }

    sendChangePasswordOnWelcome(user: any, body: any, params: any) {
        const origin = config.webappDomain;
        const {email, firstName, _id} = user;
        const {token, token_expiry} = UserDataController.generateToken(1);
        const data = {userId: _id, token: token, token_expiry: token_expiry, reseted: false};
        resetPasswordDataController.saveResetPassword(data)
            .then((response) => {
                let link = origin + "/set_new_password?token="
                    + response.token + "&email=" + email + "&welcome=true&name=" + firstName;
                const mailService = new EmailService();
                mailService.sendWelcomeEmail(email, firstName, link, body.orgIds);
            })
            .catch((error) => {
                logger.error({
                    type: "error",
                    request: {
                        params: params,
                        body: body,
                        user: user
                    },
                    message: error,
                    timeStamp: new Date()
                });
            });
    }
}