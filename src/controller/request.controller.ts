import { Request, Response } from "express";
import RequestDatacontroller from "../data/datacontroller/request.datacontroller";
import BaseController from "./base.controller";

export default class RequestController extends BaseController {

    public requestDataController: RequestDatacontroller;

    constructor(requestDataController: RequestDatacontroller) {
        super();
        this.requestDataController = requestDataController;
    }

    public createRequest(req: Request, res: Response, next: Function) {
        const request = req.body;
        if (request) {
            this.callController(
                this.requestDataController.saveNewRequest(req.params.orgId, request),
                res, 200, 400);
        } else {
            res.status(400).json({error: "invalid request"});
        }
    }

    public getSenderRequests(req: Request, res: Response, next: Function) {
        this.callController(
            this.requestDataController.getSenderRequests(req.params.orgId, req.params.userId),
            res, 200, 400);
    }

    public getRecipientRequests(req: Request, res: Response, next: Function) {
        this.callController(
            this.requestDataController.getRecipientRequests(req.params.orgId, req.params.userId),
            res, 200, 400);
    }

    public getRequests(req: Request, res: Response, next: Function) {
        this.callController(this.requestDataController.getAllRequests(req.params.orgId, req.params.userId),
            res, 200, 400);
    }

    public getRequest(req: Request, res: Response, next: Function) {
        this.callController(
            this.requestDataController.getSpecificRequestForUser(req.params.orgId, req.params.userId, req.params.requestId),
            res, 200, 400);
    }

    // TODO Implement this
    public getRecipientUsersFromRequest(req: Request, res: Response, next: Function) {
        this.callController(
            this.requestDataController.getRecipientUsersFromRequest(req.params.orgId, req.params.userId, req.params.requestId),
            res, 200, 400);
    }

}