import { OrganizationCollection } from "../database/schema/organization/organization.schema";
import Organization from "../models/organization/organization.model";

export interface OrganizationDataController {
    getOrganizationByDbName: (dbName: string) => Promise<any>;
    saveNewOrganization: (organization: Organization) => Promise<any>
}

const getOrganizationDataController = (): OrganizationDataController => {
    return {
        getOrganizationByDbName: (dbName: string): Promise<any> => {
            return OrganizationCollection().findOne({dbName: dbName}).lean().exec();
        },

        saveNewOrganization: (organization: Organization): Promise<any> => {
            return new (OrganizationCollection())(organization).save();
        }
    }

};

export { getOrganizationDataController }