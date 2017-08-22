import { Request, Response } from "express";
import BaseController from "./base.controller";
import FileTransfer from "../../service/file/filetransfer.service";
import { generateNewTokensForResetPassword } from "../../service/auth/token.manager";
import { resetPasswordDataController } from "../../data/datacontroller/resetpassword.datacontroller";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { User } from "../../data/models/common/user.model";
import { UserModel } from "../../data/database/schema/common/user.schema";
import UserManager from "../manager/user.manager";
import { formError } from "../../util/errorhandler";

const formidable = require('formidable');

export default class UserController extends BaseController {

    fileTransferService: FileTransfer;
    form: any;
    userManager: UserManager;


    constructor(fileTransferService: FileTransfer, userManager: UserManager) {
        super();
        this.fileTransferService = fileTransferService;
        this.userManager = userManager;
    }

    static showRegistrationForm(req: Request, res: Response,) {
        res.render("newUser", {
            title: "Express", organizations: [{dbName: 'hipteam', name: 'hipteam'}, {dbName: 'other', name: 'other'}]
        });
    }

    static showPictureUploadPage(req: Request, res: Response,) {
        res.render("fileUploadTest", {});
    }

    static showSetPasswordForm(req: Request, res: Response,) {
        res.render("setPassword", {token: "toke"});
    }

    createNewUser(req: Request, res: Response,) {
        const user: User = req.body;
        if (user) {
            this.callController(UserDataController.saveUser(user), res, 201, 400);
        } else {
            res.status(400).json({error: "invalid input"});
        }
    }

    getOrganizationUsers(req: any, res: Response,) {
        this.callController(UserDataController.getOrganizationUsers(req.params.orgId), res, 200, 400);
    }

    getUserByIdFromOrganization(req: Request, res: Response,) {
        this.callController(UserDataController.getUserById(req.params.orgId, req.params.userId), res, 200, 400);
    }

    resetPassword(req: Request, res: Response, next: Function) {
        return this.userManager.resetPassword(req.body.email, req.header('Origin'), req.query.welcome)
            .then((result: any) => {
                BaseController.send(res, 200, result.response);
                return result.resetPasswordToken;
            })
            .catch((err) => BaseController.send(res, 400, formError(err)));
    }

    setPassword(req: Request, res: Response,) {
        const data = req.body;
        const token = data.token;

        resetPasswordDataController.getResetPasswordByToken(token)
            .then((resetedPassword: any) => {
                return new Promise((resolve, reject) => {
                    if (resetedPassword.token_expiry <= new Date()) {
                        reject("Token expired");
                        return;
                    }
                    const {tokenExpiry, tokenExpired} = generateNewTokensForResetPassword();
                    resetPasswordDataController.updateResetPassword(resetedPassword._id, tokenExpired)
                        .then((result) => resolve(result))
                        .catch((err) => reject("Something went wrong, it was not possible to change your " +
                            "password. Please start the process again!"))
                });
            })
            .then((resetedPassword: any) =>
                UserDataController.changeUserPasswordByUserId(resetedPassword.userId, data.newPassword))
            .then((updatedUser) => {
                if (!updatedUser) {
                    res.status(404).json({error: "User not found"});
                } else {
                    res.json({
                        successMessage: "Your password was successfully changed. You can now go to Plenuum " +
                        "web app and log with new password"
                    });
                }
            })
            .catch((err: any) => res.json({error: err}));
    }

    changePassword(req: Request, res: Response,) {
        UserDataController.changeUserPassword(req.body.email, req.body.newPassword)
            .then((updatedUser: UserModel) => res
                .status(!updatedUser ? 404 : 200)
                .send(!updatedUser ? {error: "User not found"} : updatedUser)
            )
            .catch((error: any) => res.json({error: error}));

    }

    setPicture(req: any, res: Response,) {
        this.form = new formidable.IncomingForm();
        this.form.keepExtensions = true;
        this.form.parse(req, (parseError: any, fields: any, files: any) => {
            if (!parseError) {
                this.fileTransferService.sendFile(files.avatar, req.user._id)
                    .then((pictureUrl) => UserDataController.setUserPic(req.user._id, pictureUrl))
                    .then((result) => res.send(result))
                    .catch((err) => res.status(500).send({error: err}));
            } else {
                res.status(400).send({error: "Profile picture could not be set"});
            }
        });
    }
}