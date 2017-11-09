import BaseController from "./base.controller";
import { Request, Response } from "express";
import TagManager from "../manager/tag.manager";
import * as StatusCodes from 'http-status-codes';

export default class TagController extends BaseController {

    private tagManager: TagManager;

    constructor(tagManager: TagManager) {
        super();
        this.tagManager = tagManager;
    }

    async addNewTag(req: Request, res: Response) {
        return this.tagManager.addNewTag(req.params.orgId, req.body)
            .then(result => this.respond(StatusCodes.CREATED, req, res, result))
            .catch(error => this.handleError(error, req, res));
    }

    async getTags(req: Request, res: Response) {
        return this.tagManager.getTags(req.params.orgId)
            .then(result => this.respond(StatusCodes.OK, req, res, result))
            .catch(error => this.handleError(error, req, res))
    }
}