import { Request, Response } from "express";

export default class OrganizationController {

    // TODO implement this
    public createOrganization(req: Request, res: Response, next: Function) {
        res.send({});
    }

    // TODO implement this
    public showCreateOrganizationForm(req: Request, res: Response, next: Function) {
        res.render("newOrganization", {title: "Add new organization"});
    }

}