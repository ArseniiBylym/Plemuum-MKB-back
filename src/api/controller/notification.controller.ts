import BaseController from "./base.controller";
import { validate } from "../../util/input.validator";
import * as StatusCodes from 'http-status-codes';
import { Response } from 'express';
import NotificationManager from "../interactor/notification.interactor";
import { TEMPLATE } from "../../manager/notification/notification.manager";

export default class NotificationController extends BaseController {

    private notificationManager: NotificationManager;

    constructor(notificationManager: NotificationManager) {
        super();
        this.notificationManager = notificationManager;
    }

    async setNotificationDevice(req: any, res: Response) {
        req.checkBody('token', 'Missing token').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        return this.notificationManager.setNotificationDevice(req.user._id, req.body.token)
            .then((result) => res.status(StatusCodes.OK).send(result))
            .catch((err) => this.handleError(err, req, res));
    }

    async refreshNotificationDevice(req: any, res: Response) {
        req.checkBody('oldToken', 'Missing oldToken').notEmpty();
        req.checkBody('newToken', 'Missing newToken').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        return this.notificationManager.refreshNotificationDevice(req.user._id, req.body.oldToken, req.body.newToken)
            .then((result) => res.status(StatusCodes.OK).send(result))
            .catch((err) => this.handleError(err, req, res));
    }

    async removeNotificationToken(req: any, res: Response) {
        req.checkBody('token', 'Missing token').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        return this.notificationManager.removeNotificationToken(req.user._id, req.body.token)
            .then((result) => res.status(StatusCodes.OK).send(result))
            .catch((err) => this.handleError(err, req, res));
    }

    async sendNotification(req: any, res: Response) {
        req.checkBody('email', 'Missing email').notEmpty();
        req.checkBody('title', 'Missing title').notEmpty();
        req.checkBody('message', 'Missing message').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        return this.notificationManager.sendNotification(req.body.email, TEMPLATE.GENERAL(req.body.title, req.body.message))
            .then((result) => res.status(StatusCodes.OK).send(result))
            .catch((err) => this.handleError(err, req, res));
    }

}