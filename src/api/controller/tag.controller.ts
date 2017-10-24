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

    async addNewTag(req: Request, res: Response, next: Function) {
        return this.tagManager.addNewTag(req.params.orgId, req.body)
            .then(tag => res.status(StatusCodes.CREATED).send(tag))
            .catch(error => BaseController.handleError(error, req, res));
    }

    async getTags(req: Request, res: Response, next: Function) {
        return this.tagManager.getTags(req.params.orgId)
            .then(tags => res.status(StatusCodes.OK).send(tags))
            .catch(error => BaseController.handleError(error, req, res))
    }
}