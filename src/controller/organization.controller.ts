import { Request, Response } from "express";
import { databaseNameValidator } from "../util/regexp.checker";
import Organization from "../data/models/organization/organization.model";
import OrganizationDataController from "../data/datacontroller/organization.datacontroller";

export default class OrganizationController {

    public createOrganization(req: Request, res: Response, next: Function) {
        let newOrg: Organization = req.body;
        OrganizationDataController.getOrganizationByDbName(newOrg.dbName)
            .then((existingOrganization) => {
                if (!databaseNameValidator.test(newOrg.dbName) && !existingOrganization) {
                    return OrganizationDataController.saveNewOrganization(newOrg);
                } else {
                    throw new Error("The organization could not be added. Check if the dbName contains any forbidden character")
                }
            })
            .then((savedOrganization) => res.send(savedOrganization))
            .catch(reason => res.status(400).send({error: reason.message}));
    }

    public showCreateOrganizationForm(req: Request, res: Response, next: Function) {
        res.render("newOrganization", {title: "Add new organization"});
    }

}