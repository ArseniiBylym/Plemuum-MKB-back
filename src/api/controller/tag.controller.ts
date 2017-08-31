import BaseController from "./base.controller";
import { Request, Response } from "express";
import { TagDataController } from "../../data/datacontroller/tag.datacontroller";
import TagManager from "../manager/tag.manager";
import * as StatusCodes from 'http-status-codes';

export default class TagController extends BaseController {

    private tagManager: TagManager;

    constructor(tagManager: TagManager) {
        super();
        this.tagManager = tagManager;
    }

    async showNewTagForm(req: Request, res: Response, next: Function) {
        res.render("newTag", { title: "Add new tag", orgId: req.params.orgId });
    }

    async addNewTag(req: Request, res: Response, next: Function) {
        return this.tagManager.addNewTag(req.params.orgId, req.body)
            .then(tag => res.status(StatusCodes.CREATED).send(tag))
            .catch(error => BaseController.handleError(error, res));
    }

    async getTags(req: Request, res: Response, next: Function) {
        return this.tagManager.getTags(req.params.orgId)
            .then(tags => res.status(StatusCodes.OK).send(tags))
            .catch(error => BaseController.handleError(error, res))
    }
}