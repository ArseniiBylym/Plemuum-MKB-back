import BaseController from "./base.controller";
import { Request, Response } from "express";
import * as StatusCodes from 'http-status-codes';
import * as tokenManager from "../../manager/auth/token.manager";
import SessionManager from "../interactor/session.interactor";

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
                res.cookie('refreshToken', result.refreshToken, {expires: tokenManager.getExpiryAsDate(7), httpOnly: true});
                this.respond(StatusCodes.OK, req, res, result);
            })
            .catch((err: any) => this.handleError(err, req, res));
    }

    async refreshAccessToken(req: any, res: any) {

        if (!await tokenManager.checkRefreshToken(req.user._id, req.cookies.token, req.cookies.refreshToken)) {
            res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
            return;
        }

        return this.sessionManager.login(req.user._id)
            .then((result: any) => {
                    res.cookie('token', result.token, {expires: tokenManager.getExpiryAsDate(7), httpOnly: true});
                    res.cookie('refreshToken', result.refreshToken, {
                        expires: tokenManager.getExpiryAsDate(7),
                        httpOnly: true
                    });
                    this.respond(StatusCodes.OK, req, res, result);
                    tokenManager.deleteRefreshToken(req.cookies.refreshToken).catch((err: any) => this.handleError(err, req, res));
                }
            )
            .catch((err: any) => this.handleError(err, req, res));
    }

    async loginAsAdmin(req: any, res: any) {
        // TODO: ugly solution to filter non admin users
        if (req.user._id) {
            res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
            return;
        }

        return this.sessionManager.loginAsAdmin()
            .then((result: any) => {
                res.cookie('token', result.token, {httpOnly: true});
                res.cookie('refreshToken', result.refreshToken, {httpOnly: true});
                this.respond(StatusCodes.OK, req, res, result);
            })
            .catch((err: any) => this.handleError(err, req, res));
    }

    async logout(req: any, res: Response) {
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() - 1);
        res.cookie('token', "deleted", {expires: expiryDate, httpOnly: true});
        res.cookie('refreshToken', "deleted", {expires: expiryDate, httpOnly: true});
        this.respond(StatusCodes.OK, req, res);
        tokenManager.deleteRefreshToken(req.cookies.refreshToken).catch((err: any) => this.handleError(err, req, res));
    }

    async checkToken(req: Request, res: Response) {
        return this.sessionManager.checkToken(req.body.token)
            .then((result: any) => this.respond(StatusCodes.OK, req, res, result))
            .catch((err: any) => this.handleError(err, req, res));
    }
}