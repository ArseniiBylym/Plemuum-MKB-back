import { Request, Response } from "express";
import RequestDatacontroller from "../../data/datacontroller/request.datacontroller";
import BaseController from "../base.controller";

export default class RequestController extends BaseController {

    public requestDataController: RequestDatacontroller;

    constructor(requestDataController: RequestDatacontroller) {
        super();
        this.requestDataController = requestDataController;
    }

    // TODO Implement this
    public createRequest(req: Request, res: Response, next: Function) {
        const request = req.body;
        if (request) {
            this.callController(this.requestDataController.saveNewRequest(req.params.orgId, request), res, 200, 400);
        } else {
            res.status(400).json({error: "invalid request"});
        }
    }

    // TODO Implement this
    public getSenderRequests(req: Request, res: Response, next: Function) {
        res.send({});
    }

    // TODO Implement this
    public getRecipientRequests(req: Request, res: Response, next: Function) {
        res.send({});
    }

    // TODO Implement this
    public getRequests(req: Request, res: Response, next: Function) {
        res.send({});
    }

    // TODO Implement this
    public getRequest(req: Request, res: Response, next: Function) {
        res.send({});
    }

    // TODO Implement this
    public getRecipientUsersFromRequest(req: Request, res: Response, next: Function) {
        res.send({});
    }

}