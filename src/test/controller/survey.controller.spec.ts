import * as sinon from 'sinon';
import { getRequestObject } from "../util/testutil";
import SurveyController from '../../api/controller/survey.controller';
import { testUser } from '../mock/fixture.loader';
import { anyFunction } from '../../../node_modules/ts-mockito/lib/ts-mockito';
import { PlenuumError, ErrorType } from '../../util/errorhandler';

suite("SurveyController unit tests", () => {
    let res: any;
    let req: any;
    let surveyController: SurveyController;
    let surveyManager: any;
    const orgId = "orgId";

    beforeEach(() => {
        surveyManager = {};
        surveyController = new SurveyController(surveyManager);
        res = {
            status: sinon.stub().callsFake(() => res),
            send: sinon.stub()
        };
        req = {
            params: {
                orgId: orgId
            },
            body: {},
            query: {},
            user: testUser,
            checkBody: sinon.stub().returns({notEmpty: sinon.stub()})
        };
        req.getValidationResult = sinon.stub().resolves({isEmpty: sinon.stub().returns(true)});
    });

    suite("createSurvey", () => {
        test("Should return 201, the saved survey and call SurveyInteractor if input is valid", async () => {
            var survey = { title: "newSurvey" };

            req.body = survey;
            surveyManager.createSurvey = sinon.stub().withArgs(orgId, survey).resolves(survey);

            const surveyController = new SurveyController(surveyManager);
            await surveyController.createSurvey(req, res);

            sinon.assert.calledWith(surveyManager.createSurvey, orgId, survey);
            sinon.assert.calledWith(res.status, 201);
            sinon.assert.calledWith(res.send, survey);
        });

        test("Should return 400 send validation error if input is invalid and should not call SurveyInteractor", async () => {
            req.getValidationResult = sinon.stub().resolves({
                isEmpty: sinon.stub().returns(false),
                array: sinon.stub().returns([{hint: "hint"}])
            });

            surveyManager.createSurvey = sinon.stub();

            const surveyController = new SurveyController(surveyManager);
            await surveyController.createSurvey(req, res);

            sinon.assert.notCalled(surveyManager.createSurvey);
            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWithMatch(res.send, sinon.match({error: sinon.match.defined, hint: sinon.match.defined}));
        });

        test("If SurveyInteractor throws a internal error, should send 500 and the error", async () => {
            surveyManager.createSurvey = sinon.stub().rejects(new Error("Internal server error"));
            await surveyController.createSurvey(req, res);

            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledWith(res.send, {error: "Internal server error"});
        });
    });

    suite("getQuestion", () => {
        test("Should return 200, question and call SurveyInteractor if question was finded", async () => {
            const questionId = "questionId";
            req.params.questionId = questionId;
            let question : any = { question: "new question" };

            surveyManager.getQuestion = sinon.stub().resolves(question);

            const surveyController = new SurveyController(surveyManager);
            await surveyController.getQuestion(req, res);

            sinon.assert.calledWith(surveyManager.getQuestion, orgId, questionId);
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, question);
        });

        test("Should return 404 and called once SurveyInteractor if question was not finded", async () => {
            surveyManager.getQuestion = sinon.stub().resolves();

            const surveyController = new SurveyController(surveyManager);
            await surveyController.getQuestion(req, res);

            sinon.assert.calledOnce(surveyManager.getQuestion);
            sinon.assert.calledWith(res.status, 404);
        });

        test("If SurveyInteractor throws a internal error, should send 500 and the error", async () => {
            surveyManager.getQuestion = sinon.stub().rejects(new Error("Internal server error"));
            await surveyController.getQuestion(req, res);

            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledWith(res.send, {error: "Internal server error"});
        });
    });

    suite("updateQuestion", () => {
        test("Should return 200, updated question and call SurveyInteractor if question was finded", async () => {
            const questionId = "questionId";
            req.params.questionId = questionId;
            let question : any = { question: "updated question" };
            req.body = question;

            surveyManager.updateQuestion = sinon.stub().resolves(question);

            const surveyController = new SurveyController(surveyManager);
            await surveyController.updateQuestion(req, res);

            sinon.assert.calledWith(surveyManager.updateQuestion, orgId, question);
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, question);
        });

        test("Should return 404 and called once SurveyInteractor if question was not finded", async () => {
            surveyManager.getQuestion = sinon.stub().resolves();

            const surveyController = new SurveyController(surveyManager);
            await surveyController.getQuestion(req, res);

            sinon.assert.calledOnce(surveyManager.getQuestion);
            sinon.assert.calledWith(res.status, 404);
        });

        test("If SurveyInteractor throws a internal error, should send 500 and the error", async () => {
            surveyManager.updateQuestion = sinon.stub().rejects(new Error("Internal server error"));
            await surveyController.updateQuestion(req, res);

            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledWith(res.send, {error: "Internal server error"});
        });
    });

    suite("getAllSurveysTodo", () => {
        test("Should return 200, list of surveys to do and call SurveyInteractor", async () => {
            req.params.userId = testUser._id;
            let result = [{surveyTodo: "surveyTodo 1"}];
            surveyManager.getAllSurveysTodo = sinon.stub().resolves(result);

            const surveyController = new SurveyController(surveyManager);
            await surveyController.getAllSurveysTodo(req, res);

            sinon.assert.calledWith(surveyManager.getAllSurveysTodo, orgId, testUser._id);
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, result);
        });

        test("If SurveyInteractor throws a internal error, should send 500 and the error", async () => {
            surveyManager.getAllSurveysTodo = sinon.stub().rejects(new Error("Internal server error"));
            await surveyController.getAllSurveysTodo(req, res);

            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledWith(res.send, {error: "Internal server error"});
        });
    });

    suite("getSurveyTodo", () => {
        test("Should return 200, survey to do and call SurveyInteractor", async () => {
            req.params.userId = testUser._id;
            req.params.surveyTodoId = "surveyTodoId";
            let result = "surveyTodo 1";
            surveyManager.getSurveyTodo = sinon.stub().resolves(result);

            const surveyController = new SurveyController(surveyManager);
            await surveyController.getSurveyTodo(req, res);

            sinon.assert.calledWith(surveyManager.getSurveyTodo, orgId, "surveyTodoId", testUser._id);
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, result);
        });

        test("If SurveyInteractor throws a Plenuum error NOT_FOUND, should send 404 and the error message", async () => {
            surveyManager.getSurveyTodo = sinon.stub().rejects(new PlenuumError("Plenuum error", ErrorType.NOT_FOUND));
            await surveyController.getSurveyTodo(req, res);

            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledWith(res.send, {error: "Plenuum error"});
        });

        test("If SurveyInteractor throws a internal error, should send 500 and the error", async () => {
            surveyManager.getSurveyTodo = sinon.stub().rejects(new Error("Internal server error"));
            await surveyController.getSurveyTodo(req, res);

            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledWith(res.send, {error: "Internal server error"});
        });
    });

    suite("saveSurveyTodo", () => {
        test("Should return 200, saved survey to do and call SurveyInteractor", async () => {
            req.params.userId = testUser._id;
            req.params.surveyTodoId = "surveyTodoId";
            let surveyTodo = "surveyTodo";
            surveyManager.saveSurveyTodo = sinon.stub().resolves(surveyTodo);

            const surveyController = new SurveyController(surveyManager);
            await surveyController.saveSurveyTodo(req, res);

            sinon.assert.calledWith(surveyManager.saveSurveyTodo, orgId, { _id: "surveyTodoId", respondent: testUser._id });
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, surveyTodo);
        });

        test("If SurveyInteractor throws a internal error, should send 500 and the error", async () => {
            surveyManager.saveSurveyTodo = sinon.stub().rejects(new Error("Internal server error"));
            await surveyController.saveSurveyTodo(req, res);

            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledWith(res.send, {error: "Internal server error"});
        });
    });

    suite("setSurveyTodoManager", () => {
        test("Should return 200, modifieded survey to do and call SurveyInteractor", async () => {
            req.params.userId = testUser._id;
            req.params.surveyTodoId = "surveyTodoId";
            req.body.manager = "managerId";
            let surveyTodo = "surveyTodo";
            
            surveyManager.setSurveyTodoManager = sinon.stub().resolves(surveyTodo);

            const surveyController = new SurveyController(surveyManager);
            await surveyController.setSurveyTodoManager(req, res);

            sinon.assert.calledWith(surveyManager.setSurveyTodoManager, orgId, "surveyTodoId", "managerId");
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, surveyTodo);
        });

        test("If SurveyInteractor throws a internal error, should send 500 and the error", async () => {
            surveyManager.setSurveyTodoManager = sinon.stub().rejects(new Error("Internal server error"));
            await surveyController.setSurveyTodoManager(req, res);

            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledWith(res.send, {error: "Internal server error"});
        });
    });

    suite("findManager", () => {
        test("Should return 200, list of users and call SurveyInteractor", async () => {
            req.query.q = "query";
            let managers = ["manager 1", "manager 2"];
            
            surveyManager.findManager = sinon.stub().resolves(managers);

            const surveyController = new SurveyController(surveyManager);
            await surveyController.findManager(req, res);

            sinon.assert.calledWith(surveyManager.findManager, orgId, "query");
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, managers);
        });

        test("If SurveyInteractor throws a internal error, should send 500 and the error", async () => {
            surveyManager.findManager = sinon.stub().rejects(new Error("Internal server error"));
            await surveyController.findManager(req, res);

            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledWith(res.send, {error: "Internal server error"});
        });
    });
});