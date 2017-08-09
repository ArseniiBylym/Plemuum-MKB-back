import { Request, Response } from "express";
import { databaseNameValidator } from "../util/regexp.checker";
import OrganizationDataController from "../data/datacontroller/organization.datacontroller";
import Organization from "../data/models/organization.model";

export default class OrganizationController {

    private organizationDataController: OrganizationDataController;

    constructor(organizationDataController: OrganizationDataController) {
        this.organizationDataController = organizationDataController;
    }

    public createOrganization(req: Request, res: Response, next: Function) {
        let newOrg: Organization = req.body;
        this.organizationDataController.getOrganizationByDbName(newOrg.dbName)
            .then((existingOrganization) => {
                if (!databaseNameValidator.test(newOrg.dbName) && !existingOrganization) {
                    return this.organizationDataController.saveNewOrganization(newOrg);
                } else {
                    throw new Error("The organization could not be added. Check if the dbName contains any forbidden character")
                }
            })
            .then((savedOrganization) => res.send(savedOrganization))
            .catch(reason => res.status(400).send({error: reason.message}));
    }

    // TODO implement this
    public showCreateOrganizationForm(req: Request, res: Response, next: Function) {
        res.render("newOrganization", {title: "Add new organization"});
    }

}