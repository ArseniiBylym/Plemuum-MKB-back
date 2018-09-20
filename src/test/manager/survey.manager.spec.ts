import * as sinon from "sinon";
import SurveyDataController from "../../data/datacontroller/survey.datacontroller";
import SurveyManager from "../../api/interactor/survey.interactor";
import { getTestAllSurveysTodo, getTestSurveysAfterDate } from "../../util/testobject.factory";
import * as chai from 'chai';
import { PlenuumError, ErrorType } from "../../util/errorhandler";

suite("SurveyInteractor unit tests", () => {
    const orgId = "orgId";
    let surveyManager : any;
    let notificationInteractor : any;
    let groupDataController : any;

    beforeEach(() => {
        surveyManager = new SurveyManager(notificationInteractor, groupDataController);
    });

    suite("getAllSurveys", () => {
        test("Should call SurveyDataController.getAllSurveys and return the list of survey object", async () => {
            const getAllSurveys = sinon.stub(SurveyDataController, 'getAllSurveys').resolves();
            await surveyManager.getAllSurveys(orgId);

            sinon.assert.calledWith(getAllSurveys, orgId);
            getAllSurveys.restore();
        });
    });

    suite("getSurvey", () => {
        test("Should call SurveyDataController.getSurvey and return the survey object", async () => {
            const getSurvey = sinon.stub(SurveyDataController, 'getSurvey').resolves();
            await surveyManager.getSurvey(orgId, "surveyId");

            sinon.assert.calledWith(getSurvey, orgId, "surveyId");
            getSurvey.restore();
        });
    });

    suite("getAllSurveysTodo", () => {
        test("Should return a list of survey to do objects for current user", async () => {
            const userId = "5984342227cd340363dc84ad";
            const testSurveysTodo = getTestAllSurveysTodo();
            const getAllSurveyTodos = sinon.stub(SurveyDataController, 'getAllSurveyTodos').resolves(testSurveysTodo);
            const getAllSurveysTodo = sinon.stub(SurveyDataController, 'getAllSurveysTodo').resolves(testSurveysTodo);
            const getSurveysAfterDate = sinon.stub(SurveyDataController, 'getSurveysAfterDate').resolves([]);
            const createManySurveyTodo = sinon.stub(SurveyDataController, 'createManySurveyTodo').resolves([]);

            let result = await surveyManager.getAllSurveysTodo(orgId, userId);

            chai.assert.isArray(result);
            chai.assert.lengthOf(result, testSurveysTodo.length);
            sinon.assert.calledOnce(getAllSurveyTodos);
            sinon.assert.calledOnce(getAllSurveysTodo);
            sinon.assert.notCalled(createManySurveyTodo);

            getAllSurveyTodos.restore();
            getAllSurveysTodo.restore();
            createManySurveyTodo.restore();
        });

        test("Should create surveys to do at last month and return a list of survey to do objects for current user", async () => {
            const userId = "5984342227cd340363dc84ad";
            const testSurveysTodo = getTestAllSurveysTodo();
            const testSurveysAfterDate = getTestSurveysAfterDate();

            const getAllSurveyTodos = sinon.stub(SurveyDataController, 'getAllSurveyTodos').resolves(testSurveysTodo);
            const getAllSurveysTodo = sinon.stub(SurveyDataController, 'getAllSurveysTodo').resolves(testSurveysTodo);
            const createManySurveyTodo = sinon.stub(SurveyDataController, 'createManySurveyTodo').resolves([testSurveysAfterDate[1]]);

            let result = await surveyManager.getAllSurveysTodo(orgId, userId);

            chai.assert.isArray(result);
            sinon.assert.calledOnce(getAllSurveysTodo);
            sinon.assert.calledOnce(getAllSurveyTodos);

            getAllSurveyTodos.restore();
            getAllSurveysTodo.restore();
        });
    });

    suite("getSurveyTodo", () => {
        test("Should return survey to do by id", async () => {
            const userId = "5984342227cd340363dc84ad";
            const surveyTodoId = "5984342227cd340363dc84gh";
            const surveyTodo : any = {
                _id: surveyTodoId,
                respondent: userId,
                survey: "5984342227cd340363dc84ee"
            };

            const getSurveyTodo = sinon.stub(SurveyDataController, 'getSurveyTodo').resolves(surveyTodo);
            await surveyManager.getSurveyTodo(orgId, surveyTodoId, userId);

            sinon.assert.calledWith(getSurveyTodo, orgId, surveyTodoId, userId);
            getSurveyTodo.restore();
        });

        test("If SurveyDataController throws a Plenuum error NOT_FOUND, should throw error", (done) => {
            const getSurveyTodo = sinon.stub(SurveyDataController, 'getSurveyTodo').callsFake((orgId, surveyId:any, userId : any) => {
                throw new PlenuumError("Survey to do not found.", ErrorType.NOT_FOUND);
            });

            surveyManager.getSurveyTodo(orgId, "surveyTodoId", "userId")
            .then(() => {
                getSurveyTodo.restore();
                done(new Error('This case getSurveyTodo should throw an error'));
            })
            .catch((error : PlenuumError) => {
                getSurveyTodo.restore();
                chai.expect(error.message).to.be.equal("Survey to do not found.");
                done();
            });
        });
    });

    suite("saveSurveyTodo", () => {
        test("Should call SurveyDataController.saveSurveyTodo and return the survey to do object", async () => {
            const surveyTodo : any = {
                surveyTodo : "surveyTodo"
            };
            const saveSurveyTodo = sinon.stub(SurveyDataController, 'saveSurveyTodo').resolves(surveyTodo);
            await surveyManager.saveSurveyTodo(orgId, surveyTodo);

            sinon.assert.calledWith(saveSurveyTodo, orgId, surveyTodo);
            saveSurveyTodo.restore();
        });

        test("If SurveyDataController throws a Internal error, should throw error", (done) => {
            const saveSurveyTodo = sinon.stub(SurveyDataController, 'saveSurveyTodo').callsFake((orgId, surveyTodo:any) => {
                throw new Error("Something went wrong wen save survey to do.");
            });

            surveyManager.saveSurveyTodo(orgId, { surveyTodo: "surveyTodoId" })
            .then(() => {
                saveSurveyTodo.restore();
                done(new Error('This case getSurveyTodo should throw an error'));
            })
            .catch((error : PlenuumError) => {
                saveSurveyTodo.restore();
                chai.expect(error.message).to.be.equal("Something went wrong wen save survey to do.");
                done();
            });
        });
    });

    suite("findManager", () => {
        test("Should call SurveyDataController.findManager and return the list of user objects", async () => {
            const findManager = sinon.stub(SurveyDataController, 'findManager').resolves(["manager 1", "manager 2"]);
            let managers = await surveyManager.findManager(orgId, "query");

            sinon.assert.calledWith(findManager, orgId, "query");
            findManager.restore();
        });

        test("If SurveyDataController throws a Internal error, should throw error", (done) => {
            const findManager = sinon.stub(SurveyDataController, 'findManager').callsFake((orgId) => {
                throw new Error("Something went wrong wen search manager.");
            });

            surveyManager.findManager(orgId)
            .then(() => {
                findManager.restore();
                done(new Error('This case getSurveyTodo should throw an error'));
            })
            .catch((error : PlenuumError) => {
                findManager.restore();
                chai.expect(error.message).to.be.equal("Something went wrong wen search manager.");
                done();
            });
        });
    });
});