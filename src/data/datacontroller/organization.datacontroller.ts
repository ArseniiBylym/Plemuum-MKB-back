import { OrganizationCollection, OrganizationModel } from "../database/schema/organization/organization.schema";
import Organization from "../models/organization/organization.model";

export interface OrganizationDataController {
    getOrganizationByDbName: (dbName: string) => Promise<OrganizationModel>;
    getOrganizations: () => Promise<Organization[]>;
    saveNewOrganization: (organization: Organization) => Promise<any>;
    updateOrganization: (organization: Organization) => Promise<any>
}

const getOrganizationDataController = (): OrganizationDataController => {
    return {
        getOrganizations: (): Promise<Organization[]> => {
            return OrganizationCollection().find({}).lean().exec() as Promise<Organization[]>;
        },

        getOrganizationByDbName: (dbName: string): Promise<OrganizationModel> => {
            return OrganizationCollection().findOne({dbName: dbName}).lean().exec() as Promise<OrganizationModel>;
        },

        saveNewOrganization: (organization: Organization): Promise<any> => {
            return new (OrganizationCollection())(organization).save();
        },

        updateOrganization: (organization: any): Promise<any> => {
            const id = organization._id;
            delete organization._id;
            return OrganizationCollection().findByIdAndUpdate(id, organization, {new: true}).lean().exec();
        }
    }
};

export { getOrganizationDataController }