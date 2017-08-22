import GroupController from "../../api/controller/group.controller";
import * as sinon from 'sinon';

suite("Group controller tests", () => {

    const mockGroup: any = {group: "group"};
    const dataController: any = {};
    const res: any = {status: sinon.stub(), send: sinon.stub()};

    suite("createGroup", () => {
        const req: any = {params: {orgId: "mockOrg"}};

        test("Should call GroupDataController.createGroup, return a group and 201", async () => {
            dataController.createGroup = sinon.stub().resolves(mockGroup);
            const groupController = new GroupController(dataController);

            await groupController.createGroup(req, res);
            sinon.assert.calledWith(res.status, 201);
            sinon.assert.calledWith(res.send, mockGroup);
        });

        test("Should catch the error and send it to the client with status code 400", async () => {
            const datacontroller: any = {};
            datacontroller.createGroup = sinon.stub().rejects(new Error("mock createGroup error"));
            const groupController = new GroupController(datacontroller);

            await groupController.createGroup(req, res);
            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWith(res.send, {error: "mock createGroup error"});
        })
    });

    suite("getGroupById", () => {
        const req: any = {params: {orgId: "mockOrg", groupId: "groupId"}};

        test("Should call GroupDataController.getGroupById, return a group and 200", async () => {
            dataController.getGroupById = sinon.stub().resolves(mockGroup);
            const groupController = new GroupController(dataController);

            await groupController.getGroupById(req, res);
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, mockGroup);
        });

        test("Should catch the error and send it to the client with status code 400", async () => {
            dataController.getGroupById = sinon.stub().rejects(new Error("mock getGroupById error"));
            const groupController = new GroupController(dataController);

            await groupController.getGroupById(req, res);
            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWith(res.send, {error: "mock getGroupById error"});
        })
    });

    suite("getUserGroups", () => {
        const req: any = {params: {orgId: "mockOrg", userId: "userId"}};
        const groups = [mockGroup, mockGroup, mockGroup];

        test("Should call GroupDataController.getUserGroups, return a group and 200", async () => {
            dataController.getUserGroups = sinon.stub().resolves(groups);
            const groupController = new GroupController(dataController);

            await groupController.getUserGroups(req, res);
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, mockGroup);
        });

        test("Should catch the error and send it to the client with status code 400", async () => {
            dataController.getUserGroups = sinon.stub().rejects(new Error("mock getUserGroups error"));
            const groupController = new GroupController(dataController);

            await groupController.getUserGroups(req, res);
            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWith(res.send, {error: "mock getUserGroups error"});
        })
    });

    suite("putUserIntoGroup", () => {
        const req: any = {params: {orgId: "mockOrg", groupId: "groupId"}, body: {userId: "userId"}};
        const groups = [mockGroup, mockGroup, mockGroup];

        test("Should call GroupDataController.getUserGroups, return a group and 200", async () => {
            dataController.putUserIntoGroup = sinon.stub().resolves();
            const groupController = new GroupController(dataController);

            await groupController.putUserIntoGroup(req, res);
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, {success: "User has been added"});
        });

        test("Should catch the error and send it to the client with status code 400", async () => {
            dataController.putUserIntoGroup = sinon.stub().rejects(new Error("mock putUserIntoGroup error"));
            const groupController = new GroupController(dataController);

            await groupController.putUserIntoGroup(req, res);
            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWith(res.send, {error: "mock putUserIntoGroup error"});
        })
    });

    suite("removeUserFromGroup", () => {
        const req: any = {params: {orgId: "mockOrg", groupId: "groupId"}, body: {userId: "userId"}};
        const groups = [mockGroup, mockGroup, mockGroup];

        test("Should call GroupDataController.getUserGroups, return a group and 200", async () => {
            dataController.removeUserFromGroup = sinon.stub().resolves();
            const groupController = new GroupController(dataController);

            await groupController.removeUserFromGroup(req, res);
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, {success: "User has been removed"});
        });

        test("Should catch the error and send it to the client with status code 400", async () => {
            dataController.removeUserFromGroup = sinon.stub().rejects(new Error("mock removeUserFromGroup error"));
            const groupController = new GroupController(dataController);

            await groupController.removeUserFromGroup(req, res);
            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWith(res.send, {error: "mock removeUserFromGroup error"});
        })
    });

    suite("updateGroup", () => {
        const req: any = {params: {orgId: "mockOrg", groupId: "groupId"}, body: {newGroup: "newGroup"}};
        const groups = [mockGroup, mockGroup, mockGroup];

        test("Should call GroupDataController.updateGroup, return a group and 200", async () => {
            dataController.updateGroup = sinon.stub().resolves();
            const groupController = new GroupController(dataController);

            await groupController.updateGroup(req, res);
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, {success: "Group has been updated"});
        });

        test("Should catch the error and send it to the client with status code 400", async () => {
            dataController.updateGroup = sinon.stub().rejects(new Error("mock updateGroup error"));
            const groupController = new GroupController(dataController);

            await groupController.updateGroup(req, res);
            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWith(res.send, {error: "mock updateGroup error"});
        })
    })
});