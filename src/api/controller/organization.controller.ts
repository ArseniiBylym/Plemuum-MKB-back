import { Request, Response } from "express";
import BaseController from "./base.controller";
import OrganizationManager from "../manager/organization.manager";
import * as StatusCodes from 'http-status-codes';

export default class OrganizationController extends BaseController {

    private organizationManager: OrganizationManager;

    constructor(organizationManager: OrganizationManager) {
        super();
        this.organizationManager = organizationManager;
    }

    async createOrganization(req: any, res: any) {
        return this.organizationManager.createOrganization(req.body)
            .then((savedOrganization) => res.status(StatusCodes.CREATED).send(savedOrganization))
            .catch((err) => BaseController.handleError(err, res));
    }

    public static showCreateOrganizationForm(req: Request, res: Response, next: Function) {
        res.render("newOrganization", {title: "Add new organization"});
    }

}