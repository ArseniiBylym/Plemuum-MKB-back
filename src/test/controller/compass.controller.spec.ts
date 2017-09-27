import CompassController from "../../api/controller/compass.controller";
import * as sinon from 'sinon';
import { ErrorType, PlenuumError } from "../../util/errorhandler";
import CompassManager from "../../api/manager/compass.manager";
import { getRequestObject } from "../util/testutil";

suite("CompassController tests", () => {

    suite("answerCard", () => {

        let res: any;
        let compassController: CompassController;
        let compassManager: any;
        let req: any;

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
    });

    suite("answerCompass", () => {

        let res: any;
        let compassController: CompassController;
        let compassManager: any;
        let req: any;

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
                checkBody: sinon.stub().returns({
                    notEmpty: sinon.stub(),
                    len: sinon.stub()
                })
            };

            req.getValidationResult = sinon.stub().resolves({
                isEmpty: sinon.stub().returns(true)
            });
            req.params.orgId = "orgId";
            req.body.compassTodo = "compassTodo";
            req.body.sender = "sender";
            req.body.sentencesAnswer = ["sentencesAnswer"];
        });

        test("Should call CompassManager and send result with 200", async () => {
            const mockAnswer = sinon.mock();
            const answerCompass = sinon.stub(CompassManager, "answerCompass").resolves(mockAnswer);
            await compassController.answerCompass(req, res);

            answerCompass.restore();

            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, mockAnswer);
        });

        test("Should handle CompassManager error", async () => {
            const answerCompass = sinon.stub(CompassManager, "answerCompass").rejects(new PlenuumError("Error", 404));
            await compassController.answerCompass(req, res);

            answerCompass.restore();

            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledWith(res.send, {error: "Error"});
        });

        test("If fails validation, should return 400", async () => {
            req.getValidationResult = sinon.stub().resolves({
                isEmpty: sinon.stub().returns(false),
                array: sinon.stub().returns(["Error hint"])
            });

            const answerCompass = sinon.stub(CompassManager, "answerCompass");
            await compassController.answerCompass(req, res);

            answerCompass.restore();

            sinon.assert.notCalled(answerCompass);
            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWithMatch(res.send, {error: "Validation error", hint: ["Error hint"]});
        })
    });

    suite("createOrUpdateSkill", () => {
        let res: any;
        let compassController: CompassController;
        let compassManager: any;
        let req: any;

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
                checkBody: sinon.stub().returns({
                    notEmpty: sinon.stub(),
                    len: sinon.stub()
                })
            };

            req.getValidationResult = sinon.stub().resolves({
                isEmpty: sinon.stub().returns(true)
            });
            req.params.orgId = "orgId";
            req.body.compassTodo = "compassTodo";
            req.body.sender = "sender";
            req.body.sentencesAnswer = ["sentencesAnswer"];
        });

        test("Should call CompassManager and send result with 200", async () => {
            const result = sinon.mock();
            const updateSkill = sinon.stub(CompassManager, "createOrUpdateSkill").resolves(result);
            await compassController.createOrUpdateSkill(req, res);

            updateSkill.restore();

            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, result);
        });

        test("Should handle CompassManager error", async () => {
            const updateSkill = sinon.stub(CompassManager, "createOrUpdateSkill").rejects(new PlenuumError("Error", 404));
            await compassController.createOrUpdateSkill(req, res);

            updateSkill.restore();

            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledWith(res.send, {error: "Error"});
        });

        test("If fails validation, should return 400", async () => {
            req.getValidationResult = sinon.stub().resolves({
                isEmpty: sinon.stub().returns(false),
                array: sinon.stub().returns(["Error hint"])
            });

            const updateSkill = sinon.stub(CompassManager, "createOrUpdateSkill");
            await compassController.createOrUpdateSkill(req, res);

            updateSkill.restore();

            sinon.assert.notCalled(updateSkill);
            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWithMatch(res.send, {error: "Validation error", hint: ["Error hint"]});
        })
    });

    suite("createNewSkill", () => {
        let res: any;
        let compassController: CompassController;
        let compassManager: any;
        let req: any;

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
                checkBody: sinon.stub().returns({
                    notEmpty: sinon.stub(),
                    len: sinon.stub()
                })
            };

            req.getValidationResult = sinon.stub().resolves({
                isEmpty: sinon.stub().returns(true)
            });
            req.params.orgId = "orgId";
            req.body.compassTodo = "compassTodo";
            req.body.sender = "sender";
            req.body.sentencesAnswer = ["sentencesAnswer"];
        });

        test("Should call CompassManager and send result with 200", async () => {
            const result = sinon.mock();
            const createNewSkill = sinon.stub(CompassManager, "createOrUpdateSkill").resolves(result);
            await compassController.createOrUpdateSkill(req, res);

            createNewSkill.restore();

            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, result);
        });

        test("Should handle CompassManager error", async () => {
            const createNewSkill = sinon.stub(CompassManager, "createOrUpdateSkill").rejects(new PlenuumError("Error", 404));
            await compassController.createOrUpdateSkill(req, res);

            createNewSkill.restore();

            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledWith(res.send, {error: "Error"});
        });

        test("If fails validation, should return 400", async () => {
            req.getValidationResult = sinon.stub().resolves({
                isEmpty: sinon.stub().returns(false),
                array: sinon.stub().returns(["Error hint"])
            });

            const createNewSkill = sinon.stub(CompassManager, "createOrUpdateSkill");
            await compassController.createOrUpdateSkill(req, res);

            createNewSkill.restore();

            sinon.assert.notCalled(createNewSkill);
            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWithMatch(res.send, {error: "Validation error", hint: ["Error hint"]});
        })
    });

    suite("getStatistics", () => {
        let res: any;
        let compassController: CompassController;
        let compassManager: any;
        let req: any;

        beforeEach(() => {
            compassManager = {};
            compassController = new CompassController(compassManager);
            res = {
                status: sinon.stub().callsFake(() => res),
                send: sinon.stub()
            };
            req = getRequestObject(true);

            req.params.orgId = "orgId";
            req.params.userId = "userId";
            req.body.compassTodo = "compassTodo";
            req.body.sender = "sender";
            req.body.sentencesAnswer = ["sentencesAnswer"];
        });

        test("Should call CompassManager and send result with 200", async () => {
            const result = sinon.mock();
            compassManager.getStatistics = sinon.stub().resolves(result);
            await compassController.getStatistics(req, res);

            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, result);
        });

        test("Should handle CompassManager error", async () => {
            compassManager.getStatistics = sinon.stub().rejects(new PlenuumError("Error", 404));
            await compassController.getStatistics(req, res);

            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledWith(res.send, {error: "Error"});
        });
    })
});