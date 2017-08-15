import { OrganizationCollection } from "../database/schema/organization.schema";
import Organization from "../models/organization.model";

export default class OrganizationDataController {

    public getOrganizationByDbName(dbName: string): Promise<any> {
        return OrganizationCollection().findOne({dbName: dbName}).lean().exec();
    }

    public saveNewOrganization(organization: Organization): Promise<any> {
        return new (OrganizationCollection())(organization).save();
    }
}