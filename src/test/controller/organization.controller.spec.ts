import OrganizationController from "../../api/controller/organization.controller";
import * as sinon from 'sinon';
import { getRequestObject } from "../util/testutil";
import { ErrorType, PlenuumError } from "../../util/errorhandler";

const dummy: any = {};

suite("OrganizationController", () => {

    suite("createOrganization", () => {

        test("Should return 201 and the saved organization", async () => {
            const res: any = {
                send: sinon.stub(),
                status: sinon.stub().callsFake(() => res)
            };
            const req = getRequestObject(true);
            req.body = {org: "org"};

            const createOrganization = sinon.stub();
            createOrganization.withArgs({org: "org"}).resolves({org: "org", _id: "id"});
            const organizationManager: any = {createOrganization: createOrganization};

            const organizationController = new OrganizationController(organizationManager);
            await organizationController.createOrganization(req, res);

            sinon.assert.calledWith(res.status, 201);
            sinon.assert.calledWith(res.send, {org: "org", _id: "id"})
        });

        test("Should handle error", async () => {
            const res: any = {
                send: sinon.stub(),
                status: sinon.stub().callsFake(() => res)
            };
            const req = getRequestObject(true);
            req.body = {org: "org"};

            const createOrganization = sinon.stub();
            createOrganization.withArgs({org: "org"}).rejects(new PlenuumError("Mock error", ErrorType.VALIDATION));
            const organizationManager: any = {createOrganization: createOrganization};

            const organizationController = new OrganizationController(organizationManager);
            await organizationController.createOrganization(req, res);

            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWith(res.send, {error: "Mock error"})
        })

    });
});