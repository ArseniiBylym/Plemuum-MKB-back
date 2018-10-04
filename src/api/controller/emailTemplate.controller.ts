import { Request, Response } from "express";
import BaseController from "./base.controller";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { UserModel } from "../../data/database/schema/common/user.schema";
import { formError } from "../../util/errorhandler";
import * as StatusCodes from 'http-status-codes';
import { validate } from "../../util/input.validator";
import * as crypto from 'crypto';
import config from "../../../config/config";
import EmailTemplateManager from "../interactor/emailTemplate.interactor";
import agenda from "../../util/agenda";

export default class EmailTemplateController extends BaseController {

    private emailTemplateManager: EmailTemplateManager;

    constructor(emailTemplateManager: EmailTemplateManager) {
        super();
        this.emailTemplateManager = emailTemplateManager;
    }

    async getEmailTemplate(req: any, res: Response) {
        return this.emailTemplateManager.getEmailTemplate(req.params.orgId,req.params.emailType,req.params.emailLang)
            .then((result) => {
                this.respond(StatusCodes.CREATED, req, res, result)
            })
            .catch((err) => this.handleError(err, req, res))
    }

    async createEmailTemplate(req: any, res: Response) {
        req.checkBody('subject', 'Missing subject').notEmpty();
        req.checkBody('html', 'Missing html').notEmpty();
        req.body.orgId = req.params.orgId; 
        req.body.type = req.params.emailType; 
        req.body.lang = req.params.emailLang; 

        if (!await validate(req, res)) {
            return;
        }

        return this.emailTemplateManager.createEmailTemplate(req.body)
            .then((result) => {
                this.respond(StatusCodes.CREATED, req, res, result)
            })
            .catch((err) => this.handleError(err, req, res))
    }

    async modifyEmailTemplate(req: any, res: Response) {
        req.checkBody('subject', 'Missing subject').notEmpty();
        req.checkBody('html', 'Missing html').notEmpty();
        req.body.orgId = req.params.orgId; 
        req.body.type = req.params.emailType; 
        req.body.lang = req.params.emailLang; 

        if (!await validate(req, res)) {
            return;
        }

        return  this.emailTemplateManager.modifyEmailTemplate(req.body)
            .then((result) => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => this.handleError(err, req, res));
    }

}