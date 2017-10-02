import OrganizationChecker from '../../middleware/organization.checker'
import * as sinon from "sinon";
import { getTestOrganization } from "../../util/testobject.factory";

suite("Organization checked", () => {
    test("Should call next == organization was found", async () => {
        const orgDataController: any = {
            getOrganizationByDbName: sinon.stub().resolves(getTestOrganization())
        };
        const req: any = {
            params: {
                orgId: "orgId"
            }
        };
        const res: any = sinon.stub();
        const next: any = sinon.stub();
        await OrganizationChecker(orgDataController)(req, res, next);

        sinon.assert.calledOnce(next);
    });

    test("Should respond with 404 == organization was not found", async () => {
        const orgDataController: any = {
            getOrganizationByDbName: sinon.stub().resolves(null)
        };
        const req: any = {
            params: {
                orgId: "orgId"
            }
        };
        const res: any = {
            status: sinon.stub().callsFake(() => res),
            send: sinon.stub()
        };

        const next: any = sinon.stub();
        await OrganizationChecker(orgDataController)(req, res, next);

        sinon.assert.calledWith(res.status, 404);
        sinon.assert.calledWith(res.send, {error: "Organization not found"});
        sinon.assert.notCalled(next);
    })
});