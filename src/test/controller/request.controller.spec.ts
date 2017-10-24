import { getRequestObject } from "../util/testutil";
import * as sinon from "sinon";
import RequestController from "../../api/controller/request.controller";

suite("RequestController tests", () => {
    const orgId = "orgId";

    suite("createRequest", () => {

        test("Should save the request and send it back with 201", async () => {
            const req: any = getRequestObject(true);
            const res: any = {
                status: sinon.stub().callsFake(() => res),
                send: sinon.stub()
            };
            const request: any = {request: "request"};

            req.params.orgId = orgId;
            req.body = request;

            const saveNewRequest = sinon.stub();
            saveNewRequest.withArgs(orgId, request).resolves(request);
            const requestManager: any = {
                saveNewRequest: saveNewRequest
            };

            const requestController = new RequestController(requestManager);
            await requestController.createRequest(req, res);

            sinon.assert.calledWith(res.status, 201);
            sinon.assert.calledWith(res.send, request);

        });

        test("Should send validation error if input is invalid", async () => {
            const req: any = getRequestObject(false);
            const res: any = {
                status: sinon.stub().callsFake(() => res),
                send: sinon.stub()
            };
            const request: any = {request: "request"};

            req.params.orgId = orgId;
            req.body = request;

            const requestManager: any = {
                saveNewRequest: sinon.stub()
            };

            const requestController = new RequestController(requestManager);
            await requestController.createRequest(req, res);

            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWith(res.send, sinon.match({error: sinon.match.defined, hint: sinon.match.defined}));

        });

    });


});