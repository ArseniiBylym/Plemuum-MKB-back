import { OrganizationCollection } from "../database/schema/organization.schema";
import Organization from "../models/organization.model";


interface OrganizationDataController {
    getOrganizationByDbName: (dbName: string) => Promise<any>
    saveNewOrganization: (organization: Organization) => Promise<any>
}

const organizationDataController: OrganizationDataController = {

    getOrganizationByDbName: function (dbName: string): Promise<any> {
        return OrganizationCollection().findOne({dbName: dbName}).lean().exec();
    },

    saveNewOrganization: function (organization: Organization): Promise<any> {
        return new (OrganizationCollection())(organization).save();
    }
};

export { organizationDataController, OrganizationDataController }