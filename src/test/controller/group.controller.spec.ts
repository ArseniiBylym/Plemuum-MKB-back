import GroupController from "../../api/controller/group.controller";
import * as sinon from 'sinon';
import { ErrorType, PlenuumError } from "../../util/errorhandler";
import { getRequestObject } from "../util/testutil";

suite("Group controller tests", () => {

    const mockGroup: any = {group: "group"};
    const groupManager: any = {};

    suite("createGroup", () => {
        let req: any;
        let res: any;

        beforeEach(() => {
            res = {
                status: sinon.stub().callsFake(() => res),
                send: sinon.stub()
            };
        });

        test("Should call GroupDataController.createGroup, return a group and 201", async () => {
            req = getRequestObject(true);
            req.params.orgId = "mockOrg";

            groupManager.createGroup = sinon.stub().resolves(mockGroup);

            const groupController = new GroupController(groupManager);
            await groupController.createGroup(req, res);

            sinon.assert.calledWith(res.status, 201);
            sinon.assert.calledWith(res.send, mockGroup);
        });

        test("Should catch the error and send it to the client with status code 400", async () => {
            req = getRequestObject(true);
            req.params.orgId = "mockOrg";

            const groupManager: any = {};
            groupManager.createGroup = sinon.stub()
                .rejects(new PlenuumError("mock createGroup error", ErrorType.VALIDATION));

            const groupController = new GroupController(groupManager);
            await groupController.createGroup(req, res);

            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWith(res.send, {error: "mock createGroup error"});
        })
    });

    suite("getGroupById", () => {
        let req: any;
        let res: any;

        beforeEach(() => {
            res = {
                status: sinon.stub().callsFake(() => res),
                send: sinon.stub()
            };
        });

        test("Should call GroupDataController.getGroupById, return a group and 200", async () => {
            req = getRequestObject(true);
            req.params.orgId = "mockOrg";
            req.params.groupId = "groupId";


            groupManager.getGroupById = sinon.stub().resolves(mockGroup);

            const groupController = new GroupController(groupManager);
            await groupController.getGroupById(req, res);

            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, mockGroup);
        });

        test("Should catch the error and send it to the client with status code 400", async () => {
            req = getRequestObject(true);
            req.params.orgId = "mockOrg";
            req.params.groupId = "groupId";


            groupManager.getGroupById = sinon.stub()
                .rejects(new PlenuumError("mock getGroupById error", ErrorType.VALIDATION));

            const groupController = new GroupController(groupManager);
            await groupController.getGroupById(req, res);

            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWith(res.send, {error: "mock getGroupById error"});
        })
    });

    suite("getUserGroups", () => {
        let req: any;
        let res: any;
        const groups = [mockGroup, mockGroup, mockGroup];

        beforeEach(() => {
            res = {
                status: sinon.stub().callsFake(() => res),
                send: sinon.stub()
            };
        });

        test("Should call GroupDataController.getUserGroups, return a group and 200", async () => {
            req = getRequestObject(true);
            req.params.orgId = "mockOrg";
            req.params.userId = "userId";

            groupManager.getUserGroups = sinon.stub().resolves(groups);

            const groupController = new GroupController(groupManager);
            await groupController.getUserGroups(req, res);

            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, groups);
        });

        test("Should catch the error and send it to the client with status code 400", async () => {
            req = getRequestObject(true);
            req.params.orgId = "mockOrg";
            req.params.userId = "userId";

            groupManager.getUserGroups = sinon.stub()
                .rejects(new PlenuumError("mock getUserGroups error", ErrorType.VALIDATION));

            const groupController = new GroupController(groupManager);
            await groupController.getUserGroups(req, res);

            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWith(res.send, {error: "mock getUserGroups error"});
        })
    });

    suite("putUserIntoGroup", () => {
        let req: any;
        let res: any;
        const groups = [mockGroup, mockGroup, mockGroup];

        beforeEach(() => {
            res = {
                status: sinon.stub().callsFake(() => res),
                send: sinon.stub()
            };
        });

        test("Should call GroupDataController.getUserGroups, return a group and 200", async () => {
            req = getRequestObject(true);
            req.params.orgId = "mockOrg";
            req.params.groupId = "groupId";
            req.body.userId = "userId";

            groupManager.putUserIntoGroup = sinon.stub().resolves({success: "User has been added"});

            const groupController = new GroupController(groupManager);
            await groupController.putUserIntoGroup(req, res);

            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, {success: "User has been added"});
        });

        test("Should catch the error and send it to the client with status code 400", async () => {
            groupManager.putUserIntoGroup = sinon.stub()
                .rejects(new PlenuumError("mock putUserIntoGroup error", ErrorType.VALIDATION));

            const groupController = new GroupController(groupManager);
            await groupController.putUserIntoGroup(req, res);

            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWith(res.send, {error: "mock putUserIntoGroup error"});
        })
    });

    suite("removeUserFromGroup", () => {
        let req: any;
        let res: any;
        const groups = [mockGroup, mockGroup, mockGroup];

        beforeEach(() => {
            res = {
                status: sinon.stub().callsFake(() => res),
                send: sinon.stub()
            };
        });

        test("Should call GroupDataController.getUserGroups, return a group and 200", async () => {
            req = getRequestObject(true);
            req.params.orgId = "mockOrg";
            req.params.groupId = "groupId";
            req.body.userId = "userId";

            groupManager.removeUserFromGroup = sinon.stub().resolves({success: "User has been removed"});

            const groupController = new GroupController(groupManager);
            await groupController.removeUserFromGroup(req, res);

            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, {success: "User has been removed"});
        });

        test("Should catch the error and send it to the client with status code 400", async () => {
            groupManager.removeUserFromGroup = sinon.stub()
                .rejects(new PlenuumError("mock removeUserFromGroup error", ErrorType.VALIDATION));

            const groupController = new GroupController(groupManager);
            await groupController.removeUserFromGroup(req, res);

            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWith(res.send, {error: "mock removeUserFromGroup error"});
        })
    });

    suite("updateGroup", () => {
        let req: any;
        let res: any;
        const groups = [mockGroup, mockGroup, mockGroup];

        beforeEach(() => {
            res = {
                status: sinon.stub().callsFake(() => res),
                send: sinon.stub()
            };
        });

        test("Should call GroupDataController.updateGroup, return a group and 200", async () => {
            req = getRequestObject(true);
            req.params.orgId = "mockOrg";
            req.params.groupId = "groupId";
            req.body.newGroup = "newGroup";

            groupManager.updateGroup = sinon.stub().resolves({success: "Group has been updated"});

            const groupController = new GroupController(groupManager);
            await groupController.updateGroup(req, res);

            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, {success: "Group has been updated"});
        });

        test("Should catch the error and send it to the client with status code 400", async () => {
            req = getRequestObject(true);
            req.params.orgId = "mockOrg";
            req.params.groupId = "groupId";
            req.body.newGroup = "newGroup";

            groupManager.updateGroup = sinon.stub()
                .rejects(new PlenuumError("mock updateGroup error", ErrorType.VALIDATION));

            const groupController = new GroupController(groupManager);
            await groupController.updateGroup(req, res);

            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWith(res.send, {error: "mock updateGroup error"});
        })
    })
});