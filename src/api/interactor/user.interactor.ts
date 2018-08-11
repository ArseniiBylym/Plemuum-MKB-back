import UserDataController from "../../data/datacontroller/user.datacontroller";
import { resetPasswordDataController } from "../../data/datacontroller/resetpassword.datacontroller";
import { generateNewTokensForResetPassword } from "../../manager/auth/token.manager";
import { ErrorType, PlenuumError } from "../../util/errorhandler";
import { UserModel } from "../../data/database/schema/common/user.schema";
import FileManager from "../../manager/file/file.manager";
import EmailManager from "../../manager/email/mail.manager";
import * as crypto from 'crypto';
import { OrganizationDataController } from "../../data/datacontroller/organization.datacontroller";
import agenda from "../../util/agenda";
import * as Raven from 'raven';

export default class UserInteractor {

    private emailManager: EmailManager;
    private fileManager: FileManager;
    private organizationDataController: OrganizationDataController;

    constructor(emailService: EmailManager, fileManager: FileManager, organizationDataController: OrganizationDataController) {
        this.emailManager = emailService;
        this.fileManager = fileManager;
        this.organizationDataController = organizationDataController;
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

        const user = await UserDataController.getUserById(resetedPassword.userId);
        if (!user) throw new PlenuumError("User not found", ErrorType.NOT_FOUND);
        await UserDataController.changeUserPasswordByUserId(resetedPassword.userId, newPassword);
        user.passwordUpdatedAt = new Date();
        await UserDataController.updateUser(user._id, user);
        return {
            successMessage: "Your password was successfully changed. You can now go to Plenuum " +
            "web app and log with new password"
        }
    }

    async resetPassword(email: string, origin: string = '', isWelcome: boolean) {
        const user = await UserDataController.getUserByEmail(email);
        if (!user) throw new PlenuumError("User not found", ErrorType.NOT_FOUND);
        const {token, token_expiry} = UserDataController.generateToken(1);
        const data = {userId: String(user._id), token: token, token_expiry: token_expiry, reseted: false};

        const resetPassword = await resetPasswordDataController.saveResetPassword(data);
        const link = origin + "/set_new_password?token=" + resetPassword.token + "&email="
            + user.email + (isWelcome ? "&welcome=true" : "");
        const resetPasswordToken = resetPassword.token;
        const response = {email: user.email, link: link};

        await this.emailManager.sendResetEmail(user.email, link, user.firstName);
        return {resetPasswordToken: resetPasswordToken, response: response};
    }

    async userRegistrationFromCSV(csvFile: any, orgId: string) {

        const savedUsers: any[] = [];
        const users = await this.fileManager.convertCSV2UserArray(csvFile);

        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            user.orgId = orgId;
            let savedUser;
            try {
                savedUser = await this.saveUser(user, orgId);
            }
            catch (e) {
                console.log('Error creating user in user collection from csv: ',e.message);
                Raven.captureException(e);
                continue
            }
            agenda.schedule(new Date(Date.now() + i*2000),'sendWelcomeEmailsInBackground',  savedUser);
            savedUsers.push(savedUser);
        }
        return savedUsers;
    }

    async profilePictureUpload(avatar: any, userId: string) {
        const pictureUrl = await this.fileManager.uploadUserPicture(avatar, userId);
        const updatedUser = await UserDataController.setUserPic(userId, pictureUrl);

        if (!updatedUser) {
            throw new PlenuumError("User not found", ErrorType.NOT_FOUND);
        }
        return {avatar: pictureUrl}
    }

    async saveUser(body: any, orgId?: string) {
        body.admin = body.admin && body.admin === 'true';
        const organization = await this.organizationDataController.getOrganizationByDbName(orgId ? orgId : body.orgId);
        body.orgName = organization.name;
        body.passwordUpdatedAt = new Date();
        const savedUser = await UserDataController.saveUser(body);
        if (!savedUser) {
            throw new PlenuumError("User not saved", ErrorType.VALIDATION);
        }

        return savedUser;
    }

}