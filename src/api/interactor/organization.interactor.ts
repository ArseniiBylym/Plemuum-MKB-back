import { databaseNameValidator } from "../../util/regexp.checker";
import { ErrorType, PlenuumError } from "../../util/errorhandler";
import { OrganizationDataController } from "../../data/datacontroller/organization.datacontroller";

export default class OrganizationInteractor {

    public organizationDataController: OrganizationDataController;

    constructor(organizationDataController: OrganizationDataController) {
        this.organizationDataController = organizationDataController;
    }

    async createOrganization(organization: any) {
        const existingOrganization = await this.organizationDataController.getOrganizationByDbName(organization.dbName);
        if (!databaseNameValidator.test(organization.dbName) && !existingOrganization) {
            return this.organizationDataController.saveNewOrganization(organization);
        } else {
            throw new PlenuumError(
                "The organization could not be added. Check if the dbName contains any forbidden character",
                ErrorType.VALIDATION)
        }
    }

    async modifyOrganization(organization: any) {
        const existingOrganization = await this.organizationDataController.getOrganizationByDbName(organization.dbName);
        if (!existingOrganization) {
            throw new PlenuumError("Organization does not exist", ErrorType.NOT_FOUND)
        }
        return this.organizationDataController.updateOrganization(organization);
    }

    async getOrganizations() {
        return this.organizationDataController.getOrganizations();
    }
}