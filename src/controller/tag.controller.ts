import BaseController from "./base.controller";
import { Request, Response } from "express";
import TagDataController from "../data/datacontroller/tag.datacontroller";

export default class TagController extends BaseController {

    private tagDataController: TagDataController;

    constructor(tagDataController: TagDataController) {
        super();
        this.tagDataController = tagDataController;
    }

    public showNewTagForm(req: Request, res: Response, next: Function) {
        res.render("newTag", {title: "Add new tag", orgId: req.params.orgId});
    }

    public addNewTag(req: Request, res: Response, next: Function) {
        let data = req.body;
        data.isActive = true; //Always true
        this.tagDataController.getTags(req.params.orgId)
            .then(tags => {
                if (tags.findIndex((element: any) => element.title.toLowerCase() === data.title.toLowerCase()) !== -1) {
                    res.status(400).send({error: "This tag already exist"});
                    return;
                }
                data.order = tags.length + 1;
                return this.tagDataController.saveTag(req.params.orgId, data);
            })
            .then(tag => res.status(201).send(tag))
            .catch(err => res.status(400).send({error: err}));
    }

    public getTags(req: Request, res: Response, next: Function) {
        this.tagDataController.getTags(req.params.orgId)
            .then(tags => res.send(tags))
            .catch(error => res.status(400).send(error))
    }

}