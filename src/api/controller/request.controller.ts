import { Request, Response } from "express";
import BaseController from "./base.controller";
import RequestManager from "../manager/request.manager";
import * as StatusCodes from 'http-status-codes';
import { User } from "../../data/models/common/user.model";
import { validate } from "../../util/input.validator";

export default class RequestController extends BaseController {

    private requestManager: RequestManager;

    constructor(requestManager: RequestManager) {
        super();
        this.requestManager = requestManager;
    }

    async createRequest(req: any, res: Response) {
        req.checkBody('recipientId', 'recipientId').notEmpty();
        req.checkBody('requestMessage', 'requestMessage').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        req.body.senderId = req.user._id;

        this.requestManager.saveNewRequest(req.params.orgId, req.body)
            .then((result: Request) => this.respond(StatusCodes.CREATED, req, res, result))
            .catch((error: any) => this.handleError(error, req, res));
    }

    async getSenderRequests(req: any, res: Response) {
        this.requestManager.getSenderRequests(req.params.orgId, req.user._id)
            .then((result: Request[]) => this.respond(StatusCodes.OK, req, res, result))
            .catch((error: any) => this.handleError(error, req, res));
    }

    async getRecipientRequests(req: any, res: Response) {
        this.requestManager.getRecipientRequests(req.params.orgId, req.user._id)
            .then((result: Request[]) => this.respond(StatusCodes.OK, req, res, result))
            .catch((error: any) => this.handleError(error, req, res));
    }

    //TODO implement showReplied
    async getRequests(req: any, res: Response) {
        this.requestManager.getRequests(req.params.orgId, req.user._id)
            .then((result: Request[]) => this.respond(StatusCodes.OK, req, res, result))
            .catch((error: any) => this.handleError(error, req, res));
    }

    async getRequest(req: any, res: Response) {
        this.requestManager.getRequest(req.params.orgId, req.user._id, req.params.requestId)
            .then((result: Request) => this.respond(StatusCodes.OK, req, res, result))
            .catch((error: any) => this.handleError(error, req, res));
    }

    async getRecipientUsersFromRequest(req: any, res: Response) {
        this.requestManager.getRecipientUsersFromRequest(req.params.orgId, req.user._id, req.params.requestId)
            .then((result: User[]) => this.respond(StatusCodes.OK, req, res, result))
            .catch((error: any) => this.handleError(error, req, res));
    }
}