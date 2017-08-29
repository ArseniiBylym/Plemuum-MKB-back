import CompassController from "../../api/controller/compass.controller";
import * as sinon from 'sinon';
import { ErrorType, PlenuumError } from "../../util/errorhandler";

suite.only("CompassController tests", () => {

    let res: any;
    let compassController: CompassController;
    let compassManager: any;
    let req: any;

    suite("answerCard", () => {
        beforeEach(() => {
            compassManager = {};
            compassController = new CompassController(compassManager);
            res = {
                status: sinon.stub().callsFake(() => res),
                send: sinon.stub()
            };
            req = {
                params: {},
                body: {},
                checkBody: sinon.stub().returns({notEmpty: sinon.stub()})
            };

            req.getValidationResult = sinon.stub().resolves({isEmpty: sinon.stub().returns(true)});
            req.params.orgId = "orgId";
            req.body.aboutUserId = "aboutUserId";
            req.body.senderId = "senderId";
            req.user = {_id: "userId"};
        });

        test("Should call CompassManager and send result with 200", async () => {
            const mockTodo = sinon.mock();
            compassManager.answerCard = sinon.stub().resolves(mockTodo);
            await compassController.answerCard(req, res);

            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, mockTodo);
            res = null;
        });

        test("If CompassManager throws a Plenuum error, should use the error status code and send the error", async () => {
            compassManager.answerCard = sinon.stub().rejects(new PlenuumError("Plenuum error", ErrorType.NOT_FOUND));
            await compassController.answerCard(req, res);

            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledWith(res.send, {error: "Plenuum error"});
        });

        test("If CompassManager throws a regular error, should send 500 and the error", async () => {
            compassManager.answerCard = sinon.stub().rejects(new Error("Plenuum error"));
            await compassController.answerCard(req, res);

            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledWith(res.send, {error: "Plenuum error"});
        });

        test("If input is invalid, should return 400, an error with a hint and should not call CompassManager", async () => {
            req.getValidationResult = sinon.stub().resolves({
                isEmpty: sinon.stub().returns(false),
                array: sinon.stub().returns(["Error hint"])
            });

            compassManager.answerCard = sinon.stub();
            await compassController.answerCard(req, res);

            sinon.assert.notCalled(compassManager.answerCard);
            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWithMatch(res.send, {error: "Validation error", hint: ["Error hint"]});
        })
    })
});