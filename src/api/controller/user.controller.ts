import { Request, Response } from "express";
import BaseController from "./base.controller";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { UserModel } from "../../data/database/schema/common/user.schema";
import { formError } from "../../util/errorhandler";
import * as StatusCodes from 'http-status-codes';
import { validate } from "../../util/input.validator";
import * as crypto from 'crypto';
import config from "../../../config/config";
import UserManager from "../interactor/user.interactor";

const formidable = require('formidable');

export default class UserController extends BaseController {

    private userManager: UserManager;

    constructor(userManager: UserManager) {
        super();
        this.userManager = userManager;
    }

    async registerUser(req: any, res: Response) {
        req.checkBody('firstName', 'Missing firstName').notEmpty();
        req.checkBody('lastName', 'Missing lastName').notEmpty();
        req.checkBody('email', 'Missing email').notEmpty();
        req.checkBody('orgIds', 'User must be part of an organization (orgIds is missing or empty)').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        if (!req.body.password) {
            req.body.password = crypto.randomBytes(16).toString('hex');
        }

        return this.userManager.saveUser(req.body)
            .then((result) => this.respond(StatusCodes.CREATED, req, res, result))
            .catch((err) => this.handleError(err, req, res))
    }

    async registerUsersFromCSV(req: any, res: Response) {
        return this.handleCSVUserRegistration(req)
            .then((result) => this.respond(StatusCodes.OK, req, res, result))
            .catch((err: Error) => res.status(400).send(formError(err)))
    }

    async modifyUser(req: any, res: Response) {
        req.checkBody('_id', 'Missing _id').notEmpty();
        req.checkBody('firstName', 'Missing firstName').notEmpty();
        req.checkBody('lastName', 'Missing lastName').notEmpty();
        req.checkBody('email', 'Missing email').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        return this.userManager.updateUser(req.body)
            .then((result) => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => this.handleError(err, req, res));
    }

    async getOrganizationUsers(req: any, res: Response) {
        return UserDataController.getOrganizationUsers(req.params.orgId)
            .then((result) => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => this.handleError(err, req, res));
    }

    async getUserByIdFromOrganization(req: Request, res: Response) {
        return UserDataController.getUserByIdFromOrg(req.params.orgId, req.params.userId)
            .then((result) => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => this.handleError(err, req, res));
    }

    async getUserByToken(req: any, res: any) {
        try {
            const result = {
                _id: req.user._id,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                pictureUrl: req.user.pictureUrl,
                orgIds: req.user.orgIds
            };
            this.respond(StatusCodes.OK, req, res, result);
        } catch (err) {
            this.handleError(err, req, res)
        }
    }

    async resetPassword(req: Request, res: Response) {
        req.checkBody('email', 'Missing email').notEmpty();
        req.checkBody('email', 'Invalid email').isEmail();

        if (!await validate(req, res)) {
            return;
        }

        return this.userManager.resetPassword(req.body.email, config.webappDomain, req.query.welcome)
            .then((result) => {
                this.respond(StatusCodes.OK, req, res, result.response);
                return result.resetPasswordToken;
            })
            .catch((err) => this.handleError(err, req, res));
    }

    async setPassword(req: any, res: any) {
        req.checkBody('token', 'Missing token').notEmpty();
        req.checkBody('newPassword', 'Missing newPassword').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        return this.userManager.setPassword(req.body.token, req.body.newPassword)
            .then((result) => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => this.handleError(err, req, res));
    }

    async changePassword(req: Request, res: Response) {
        req.checkBody('email', 'Missing email').notEmpty();
        req.checkBody('email', 'Invalid email').isEmail();
        req.checkBody('password', 'Missing password').notEmpty();
        req.checkBody('newPassword', 'Missing newPassword').notEmpty();

        if (!await validate(req, res)) {
            return;
        }
        return UserDataController.changeUserPassword(req.body.email, req.body.password, req.body.newPassword)
            .then((result: UserModel) =>
                this.respond(!result ? StatusCodes.NOT_FOUND : StatusCodes.OK, req, res,
                    !result ? {error: "User not found"} : {message: "Password has been changed"}))
            .catch((err) => this.handleError(err, req, res));
    }

    async setPicture(req: any, res: Response) {
        return this.handleProfilePictureUpload(req)
            .then((result) => this.respond(StatusCodes.OK, req, res, result))
            .catch((err: Error) => res.status(400).send(formError(err)))
    }

    private async handleCSVUserRegistration(req: any): Promise<any> {
        const form = new formidable.IncomingForm();
        form.keepExtensions = true;
        const {parseError, files} = await this.parseForm(req, form);
        if (!parseError) {
            this.userManager.userRegistrationFromCSV(files.users, req.params.orgId);
            return {message: "Registration process has been initiated"}
        }
        throw new Error("Users could not be registered");
    }

    private async handleProfilePictureUpload(req: any): Promise<any> {
        const form = new formidable.IncomingForm();
        form.keepExtensions = true;
        const {parseError, fields, files} = await this.parseForm(req, form);
        if (!parseError) {
            return this.userManager.profilePictureUpload(files.avatar, req.user._id);
        }
        throw new Error("Profile picture could not be set");
    }

    private async parseForm(req: any, form: any): Promise<any> {
        return new Promise((resolve) => {
            form.parse(req, (parseError: any, fields: any, files: any) => resolve({parseError, fields, files}));
        });
    }


}