import { Request, Response } from "express";
import UserDataController from "../data/datacontroller/user.datacontroller";
import { User } from "../data/models/user.model";
import BaseController from "./base.controller";
import ResetPasswordDataController from "../data/datacontroller/resetpassword.datacontroller";
import { UserModel } from "../data/database/schema/user.schema";
import EmailService from "../email/mail.service";
import FileTransfer from "../files/filetransfer.service";

const formidable = require('formidable');

export default class UserController extends BaseController {

    private userDataController: UserDataController;
    private resetPasswordDataController: ResetPasswordDataController;
    private emailService: EmailService;
    private fileTransferService: FileTransfer;
    private form: any;

    constructor(userDataController: UserDataController, resetPasswordDataController: ResetPasswordDataController,
                emailService: EmailService, fileTransferService: FileTransfer) {
        super();
        this.userDataController = userDataController;
        this.resetPasswordDataController = resetPasswordDataController;
        this.emailService = emailService;
        this.fileTransferService = fileTransferService;
    }

    public static showRegistrationForm(req: Request, res: Response,) {
        res.render("newUser", {
            title: "Express", organizations: [
                {dbName: 'hipteam', name: 'hipteam'}, {dbName: 'other', name: 'other'}]
        });
    }

    public createNewUser(req: Request, res: Response,) {
        const user: User = req.body;
        if (user) {
            this.callController(this.userDataController.saveUser(user), res, 201, 400);
        } else {
            res.status(400).json({error: "invalid input"});
        }
    }

    public getOrganizationUsers(req: any, res: Response,) {
        this.callController(this.userDataController.getOrganizationUsers(req.params.orgId), res, 200, 400);
    }

    public getUserByIdFromOrganization(req: Request, res: Response,) {
        this.callController(this.userDataController.getUserById(req.params.orgId, req.params.userId), res, 200, 400);
    }

    public resetPassword(req: Request, res: Response, next: Function) {
        let user: UserModel;
        let resetPasswordToken: any;
        let response: any;
        return this.userDataController.getUserByEmail(req.body.email)
            .then((u: UserModel) => {
                user = u;
                const {token, token_expiry} = UserDataController.generateToken(1);
                const data = {userId: String(user["_id"]), token: token, token_expiry: token_expiry, reseted: false};
                return this.resetPasswordDataController.saveResetPassword(data)
            })
            .then(resetPassword => {
                const link = req.header('Origin') + "/set_new_password?token=" + resetPassword.token + "&email="
                    + user.email + (req.query.welcome ? "&welcome=true" : ""); //TODO header is undefined, do not forget to check why
                resetPasswordToken = resetPassword.token;
                response = {email: user.email, link: link};
                return this.emailService.sendResetEmail(user.email, link);
            })
            .then(() => {
                res.send(response);
                return resetPasswordToken;
            })
            .catch(err => res.status(400).send({error: err}));
    }

    //TODO implement this
    public static setPassword(req: Request, res: Response,) {
        res.json({msg: "set password"});
    }

    public changePassword(req: Request, res: Response,) {
        if (req.body.newPassword != req.body.passwordAgain) {
            res.status(400).json({error: "Passwords do not match"})
        } else {
            this.userDataController.changeUserPassword(req.body.email, req.body.newPassword)
                .then((updatedUser: UserModel) => res
                    .status(!updatedUser ? 404 : 200)
                    .send(!updatedUser ? {error: "User not found"} : updatedUser)
                )
                .catch((error) => res.json({error: error}));
        }
    }

    public setPicture(req: any, res: Response,) {
        this.form = new formidable.IncomingForm();
        this.form.keepExtensions = true;
        this.form.parse(req, (parseError: any, fields: any, files: any) => {
            if (!parseError) {
                this.fileTransferService.sendFile(files.avatar, req.user._id)
                    .then((pictureUrl) => this.userDataController.setUserPic(req.user._id, pictureUrl))
                    .then((result) => res.send(result))
                    .catch((err) => res.status(500).send({error: err}));
            } else {
                res.status(400).send({error: "Profile picture could not be set"});
            }
        });
    }

    public showPictureUploadPage(req: Request, res: Response,) {
        res.render("fileUploadTest", {});
    }
}