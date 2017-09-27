import BaseController from "./base.controller";
import { Request, Response } from "express";
import SessionManager from "../manager/session.manager";
import * as StatusCodes from 'http-status-codes';

export default class SessionController extends BaseController {

    private sessionManager: SessionManager;

    constructor(sessionManager: SessionManager) {
        super();
        this.sessionManager = sessionManager;
    }

    async login(req: any, res: Response, next: Function) {
        return this.sessionManager.login(req.user._id)
            .then((result: any) => res.status(StatusCodes.OK).send(result))
            .catch((err: any) => BaseController.handleError(err, res));
    }

    async logout(req: any, res: Response, next: Function) {
        return this.sessionManager.logout(req.user._id)
            .then((result: any) => res.status(StatusCodes.OK).send(result))
            .catch((err: any) => BaseController.handleError(err, res));
    }

    async checkToken(req: Request, res: Response, next: Function) {
        return this.sessionManager.checkToken(req.body.token)
            .then((result: any) => res.status(StatusCodes.OK).send(result))
            .catch((err: any) => BaseController.handleError(err, res));
    }
}