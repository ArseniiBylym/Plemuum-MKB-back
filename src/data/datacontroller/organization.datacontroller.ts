import { OrganizationCollection } from "../database/schema/organization/organization.schema";
import Organization from "../models/organization/organization.model";

const OrganizationDataController = {

    getOrganizationByDbName: function (dbName: string): Promise<any> {
        return OrganizationCollection().findOne({dbName: dbName}).lean().exec();
    },

    saveNewOrganization: function (organization: Organization): Promise<any> {
        return new (OrganizationCollection())(organization).save();
    }
};

export default OrganizationDataController