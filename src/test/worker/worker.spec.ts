import WorkerPlenuum from "../../worker/compass.worker";
import * as sinon from "sinon";
import * as Sinon from "sinon";
import { expect } from 'chai';
import CompassManager from "../../api/manager/compass.manager";
import * as ManagerFactory from "../../factory/manager.factory";

suite("Worker test cases", () => {

    //Should happen every 4 days at 8:00:00 am, so 1, 5, 9 ...
    const mockListOrg = [
        { compassGenerationTime: "0 0 8 */4 * *", name: "mock org name" },
        { compassGenerationTime: "0 0 8 */4 * *", name: "mock org name 2"}];
    const orgId = "hipteam";
    let mockDate: any;

    const getUserGroups = sinon.stub();
    const getOrganizationByDbName = sinon.stub();
    const groupDataController: any = { getUserGroups: getUserGroups };

    beforeEach(() => {
        mockDate = sinon.useFakeTimers((new Date(2018,0,5)).getTime());
        getOrganizationByDbName.withArgs(orgId)
            .resolves({ dbName: orgId, todoSentenceNumber: 3 });
    });

    afterEach(() => {
        mockDate.restore();
    });

    suite("Happy cases", () => {

        test("Should be true if worker was called", (done) => {

            const organizationDataController: any = {
                getOrganizationByDbName: getOrganizationByDbName,
                getOrganizations: sinon.stub().resolves(mockListOrg) };
            const compassManager = ManagerFactory.getCompassManager();

            const autoGenerateTodoStub: Sinon.SinonSpy = sinon.stub(compassManager, "autoGenerateTodo")
                 .resolves("mock success response");

            const time = "*/10 * * * * *";
            const worker = new WorkerPlenuum(time, organizationDataController, compassManager);
            worker.executeJob(organizationDataController, compassManager)
                .then(() => {
                    autoGenerateTodoStub.restore();
                    expect(autoGenerateTodoStub.called).to.be.true;
                    done();
                });
        });
    });

    suite("Sad cases", () => {
        test("Should not call the test", (done) => {
            const organizationDataController: any = {
                getOrganizationByDbName: getOrganizationByDbName,
                getOrganizations: sinon.stub().rejects("mock error response") };
            const compassManager = ManagerFactory.getCompassManager();

            const autoGenerateTodoStub: Sinon.SinonSpy = sinon.stub(compassManager, "autoGenerateTodo")
                .rejects("mock error response");

            const time = "*/10 * * * * *";
            const worker = new WorkerPlenuum(time, organizationDataController, compassManager);
            worker.executeJob(organizationDataController, compassManager)
                .catch(() => {
                    autoGenerateTodoStub.restore();
                    expect(autoGenerateTodoStub.called).to.be.false;
                    done();
                });
        });
    });
});