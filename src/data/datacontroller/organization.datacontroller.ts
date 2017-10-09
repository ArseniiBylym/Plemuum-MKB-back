import { OrganizationCollection } from "../database/schema/organization/organization.schema";
import Organization from "../models/organization/organization.model";

export interface OrganizationDataController {
    getOrganizationByDbName: (dbName: string) => Promise<Organization>;
    getOrganizations: () => Promise<Organization[]>;
    saveNewOrganization: (organization: Organization) => Promise<any>
}

const getOrganizationDataController = (): OrganizationDataController => {
    return {
        getOrganizations: (): Promise<Organization[]> => {
            return OrganizationCollection().find({}).lean().exec() as Promise<Organization[]>;
        },

        getOrganizationByDbName: (dbName: string): Promise<Organization> => {
            return OrganizationCollection().findOne({dbName: dbName}).lean().exec() as Promise<Organization>;
        },

        saveNewOrganization: (organization: Organization): Promise<any> => {
            return new (OrganizationCollection())(organization).save();
        }
    }
};

export { getOrganizationDataController }