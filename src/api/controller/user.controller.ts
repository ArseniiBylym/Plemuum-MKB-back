import { Request, Response } from "express";
import BaseController from "./base.controller";

import { generateNewTokensForResetPassword } from "../../service/auth/token.manager";
import { resetPasswordDataController } from "../../data/datacontroller/resetpassword.datacontroller";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { User } from "../../data/models/common/user.model";
import { UserModel } from "../../data/database/schema/common/user.schema";
import UserManager from "../manager/user.manager";
import { formError } from "../../util/errorhandler";
import { promisify } from "util";
import * as StatusCodes from 'http-status-codes';
import { validate } from "../../util/input.validator";

const formidable = require('formidable');

export default class UserController extends BaseController {

    private userManager: UserManager;

    constructor(userManager: UserManager) {
        super();
        this.userManager = userManager;
    }

    static showRegistrationForm(req: Request, res: Response) {
        res.render("newUser", { title: "Express", organizations: [{ dbName: 'hipteam', name: 'hipteam' }, { dbName: 'other', name: 'other' }] });
    }

    static showPictureUploadPage(req: Request, res: Response, ) {
        res.render("fileUploadTest", {});
    }

    static showSetPasswordForm(req: Request, res: Response, ) {
        res.render("setPassword", { token: "toke" });
    }

    async createNewUser(req: any, res: Response) {
        req.checkBody('firstName', 'Missing firstName').notEmpty();
        req.checkBody('lastName', 'Missing lastName').notEmpty();
        req.checkBody('email', 'Missing email').notEmpty();

        if (!await validate(req, res)) {
            return;
        }
        return UserDataController.saveUser(req.body)
            .then((result) => res.status(StatusCodes.CREATED).send(result))
            .catch((err) => BaseController.handleError(err, res));
    }

    async getOrganizationUsers(req: any, res: Response) {
        return UserDataController.getOrganizationUsers(req.params.orgId)
            .then((result) => res.status(StatusCodes.OK).send(result))
            .catch((err) => BaseController.handleError(err, res));
    }

    async getUserByIdFromOrganization(req: Request, res: Response) {
        return UserDataController.getUserById(req.params.orgId, req.params.userId)
            .then((result) => res.status(StatusCodes.OK).send(result))
            .catch((err) => BaseController.handleError(err, res));
    }

    async resetPassword(req: Request, res: Response) {
        req.checkBody('email', 'Missing email').notEmpty();
        req.checkBody('email', 'Invalid email').isEmail();

        if (!await validate(req, res)) {
            return;
        }

        return this.userManager.resetPassword(req.body.email, req.header('Origin'), req.query.welcome)
            .then((result) => {
                res.status(StatusCodes.OK).send(result.response)
                return result.resetPasswordToken;
            })
            .catch((err) => BaseController.handleError(err, res));
    }

    async setPassword(req: any, res: any) {
        req.checkBody('token', 'Missing token').notEmpty();
        req.checkBody('newPassword', 'Missing newPassword').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        return this.userManager.setPassword(req.body.token, req.body.newPassword)
            .then((result) => res.status(StatusCodes.OK).send(result))
            .catch((err) => BaseController.handleError(err, res));
    }

    async changePassword(req: Request, res: Response) {
        req.checkBody('email', 'Missing email').notEmpty();
        req.checkBody('email', 'Invalid email').isEmail();
        req.checkBody('password', 'Missing password').notEmpty();
        req.checkBody('newPassword', 'Missing newPassword').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        return UserDataController.changeUserPassword(req.body.email, req.body.newPassword)
            .then((updatedUser: UserModel) => res
                .status(!updatedUser ? 404 : 200)
                .send(!updatedUser ? { error: "User not found" } : updatedUser)
            )
            .catch((err) => BaseController.handleError(err, res));
    }

    async setPicture(req: any, res: Response) {
        return this.handleProfilePictureUpload(req, req.user._id)
            .then((result) => res.send(result))
            .catch((err: Error) => res.status(400).send(formError(err)))
    }

    async setNotificationDevice(req: any, res: Response) {
        req.checkBody('token', 'Missing token').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        return UserDataController.setUserNotificationDevice(req.user._id, req.body.token)
            .then((result) => res.send(result))
            .catch((err) => BaseController.handleError(err, res));
    }

    async refreshNotificationDevice(req: any, res: Response) {
        req.checkBody('oldToken', 'Missing oldToken').notEmpty();
        req.checkBody('newToken', 'Missing newToken').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        return UserDataController.refreshNotificationDevice(req.user._id, req.body.oldToken, req.body.newToken)
            .then((result) => res.send(result))
            .catch((err) => BaseController.handleError(err, res));
    }

    async removeNotificationToken(req: any, res: Response) {
        req.checkBody('token', 'Missing token').notEmpty();

        if (!await validate(req, res)) {
            return;
        }
        
        return UserDataController.removeNotificationToken(req.user._id, req.body.token)
            .then((result) => res.send(result))
            .catch((err) => BaseController.handleError(err, res));
    }

    private async handleProfilePictureUpload(req: any, userId: string): Promise<any> {
        const form = new formidable.IncomingForm();
        form.keepExtensions = true;
        const { parseError, fields, files } = await this.parseForm(req, form);
        if (!parseError) {
            return this.userManager.profilePictureUpload(files.avatar, req.user._id);
        }
        throw new Error("Profile picture could not be set");
    }

    private async parseForm(req: any, form: any): Promise<any> {
        return new Promise((resolve, reject) => {
            form.parse(req, (parseError: any, fields: any, files: any) => resolve({ parseError, fields, files }));
        });
    }
}