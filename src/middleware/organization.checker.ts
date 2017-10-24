import { OrganizationDataController } from "../data/datacontroller/organization.datacontroller";

export default (organizationDataController: OrganizationDataController) => async (req: any, res: any, next: Function) => {
    const organization = await organizationDataController.getOrganizationByDbName(req.params.orgId);
    if (organization) {
        next();
    } else {
        res.status(404).send({error: "Organization not found"});
    }
}