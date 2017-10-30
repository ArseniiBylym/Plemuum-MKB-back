import BaseController from "./base.controller";
import { Request, Response } from "express";
import SessionManager from "../manager/session.manager";
import * as StatusCodes from 'http-status-codes';
import * as tokenManager from "../../service/auth/token.manager";

export default class SessionController extends BaseController {

    private sessionManager: SessionManager;

    constructor(sessionManager: SessionManager) {
        super();
        this.sessionManager = sessionManager;
    }

    async login(req: any, res: any) {
        return this.sessionManager.login(req.user._id)
            .then((result: any) => {
                res.cookie('token', result.token, {expires: tokenManager.getExpiryAsDate(7), httpOnly: true});
                res.status(StatusCodes.OK).send(result);
            })
            .catch((err: any) => BaseController.handleError(err, req, res));
    }

    async loginAsAdmin(req: any, res: any) {
        return this.sessionManager.loginAsAdmin(req.user._id)
            .then((result: any) => {
                res.cookie('token', result.token, {expires: tokenManager.getExpiryAsDate(7), httpOnly: true});
                res.status(StatusCodes.OK).send(result);
            })
            .catch((err: any) => BaseController.handleError(err, req, res));
    }

    async logout(req: any, res: Response) {
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() - 1);
        res.cookie('token', "deleted", {expires: expiryDate, httpOnly: true});
        res.status(StatusCodes.OK).send();
    }

    async checkToken(req: Request, res: Response) {
        return this.sessionManager.checkToken(req.body.token)
            .then((result: any) => res.status(StatusCodes.OK).send(result))
            .catch((err: any) => BaseController.handleError(err, req, res));
    }
}