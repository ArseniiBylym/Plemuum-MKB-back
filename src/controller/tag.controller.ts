import BaseController from "./base.controller";
import { Request, Response } from "express";

export default class TagController extends BaseController {

    // TODO Implement this
    public showNewTagForm(req: Request, res: Response, next: Function) {
        res.render("newTag", {title: "Add new tag", orgId: req.params.orgId});
    }

    // TODO Implement this
    public addNewTag(req: Request, res: Response, next: Function) {
        res.send({msg: "addNewTag"});
    }

    // TODO Implement this
    public getTags(req: Request, res: Response, next: Function) {
        res.send([]);
    }

}