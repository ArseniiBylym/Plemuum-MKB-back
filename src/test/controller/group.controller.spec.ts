import GroupController from "../../api/controller/group.controller";

const td = require("testdouble");

suite("Group controller tests", () => {
    const req: any = td.object();
    const res: any = td.object();
    const dummy: any = undefined;
    const datacontroller: any = {};

    suite("createGroup", () => {
        const mockGroup: any = {
            group: "group"
        };
        req.params.orgId = "mockOrg";
        req.body = {value: "mockBody"};

        test("Should call GroupDataController.createGroup, return a group and 201", function (done) {
            res.status = res.send = datacontroller.createGroup = td.function();
            td.when(datacontroller.createGroup(req.params.orgId, req.body)).thenResolve(mockGroup);
            const groupController = new GroupController(datacontroller);

            groupController.createGroup(req, res, dummy).then(() => {
                td.verify(res.status(201));
                td.verify(res.send(mockGroup));
                done();
            }).catch((err) => done(err));
        });

        test("Should catch the error and send it to the client with status code 400", done => {
            res.status = res.send = datacontroller.createGroup = td.function();
            td.when(datacontroller.createGroup(req.params.orgId, req.body)).thenReject(new Error("mock error"));
            const groupController = new GroupController(datacontroller);

            groupController.createGroup(req, res, dummy).then((asd) => {
                td.verify(res.status(400));
                td.verify(res.send({error: "mock error"}));
                done();
            }).catch((err) => done(err));
        })
    })
});