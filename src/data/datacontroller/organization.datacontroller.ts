import { OrganizationCollection, OrganizationModel } from "../database/schema/organization.schema";
import BaseDataController from "./base.datacontroller";
import DatabaseManager from "../database/database.manager";
import Organization from "../models/organization.model";

export default class OrganizationDataController extends BaseDataController<OrganizationModel> {

    constructor(databaseManager: DatabaseManager) {
        super(databaseManager, OrganizationCollection);
    }

    public getOrganizationByDbName(dbName: string): Promise<Organization> {
        return new Promise((resolve, reject) => {
            OrganizationCollection().findOne({dbName: dbName})
                .lean()
                .exec((err, organization: Organization) => err ? reject(err) : resolve(organization));
        });
    }

    public saveNewOrganization(organization: Organization): Promise<Organization> {
        return new Promise((resolve, reject) => {
            const organizationCollection = OrganizationCollection();
            new organizationCollection(organization)
                .save((err, organizationResult) => err ? reject(err) : resolve(organizationResult));
        });
    }

}