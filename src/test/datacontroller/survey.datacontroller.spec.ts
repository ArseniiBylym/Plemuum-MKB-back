import { getDatabaseManager } from "../../factory/database.factory";
import config from "../../../config/config";
import { fixtureLoader, testUser } from "../mock/fixture.loader";
import SurveyDataController from "../../data/datacontroller/survey.datacontroller";
import * as chai from 'chai';
import { SurveyTodoModel, SurveyTodoCollection } from "../../data/database/schema/organization/survey/surveyTodo.schema";
import { PlenuumError } from "../../util/errorhandler";

suite("Survey datacontroller", () => {
    const orgID = "hipteam";

    before((done) => {
        getDatabaseManager(config.mongoUrl).openConnection()
            .then(() => fixtureLoader())
            .then(value => done())
            .catch((error) => {
                console.error(error);
                done();
            })
    });

    after(done => {
        getDatabaseManager().closeConnection()
            .then(() => done())
            .catch(() => done());
    });

    suite("getAllSurveysTodo", () => {
        test("Should get an array of survey to do objects", async () => {
            const userID = "5984342227cd340363dc84ad";

            const surveysTodo = await SurveyDataController.getAllSurveysTodo(orgID, userID);

            chai.should().exist(surveysTodo);
            chai.expect(surveysTodo).length(2);
        })
    });

    suite("getSurveysAfterDate", () => {
        test("Should get an array of survey created after some date", async () => {
            const date : Date =  new Date("2018-07-25 10:50:00.000");

            const surveys = await SurveyDataController.getSurveysAfterDate(orgID, date);

            chai.should().exist(surveys);
            chai.expect(surveys).length(1);
        })
    });

    suite("createSurveyTodo", () => {
        test("Should be able to create a new survey to do", (done) => {
            let surveyTodo : any = {
                survey: "5b531d15617b0c1fb0c73658",
                respondent: "5984342227cd340363dc84c7"
            } as SurveyTodoModel;

            SurveyDataController.createSurveyTodo(orgID, surveyTodo)
                .then(() => SurveyTodoCollection(orgID).find({survey: "5b531d15617b0c1fb0c73658", respondent: "5984342227cd340363dc84c7"}).lean().exec())
                .then((item: any) => {
                    chai.should().exist(item);
                    done();
                })
        })
    });

    suite("createManySurveyTodo", () => {
        test("Should be able to create many a new survey to do", (done) => {
            let surveysTodo : any = [{
                survey: "5b531d15617b0c1fb0c73699",
                respondent: "5984342227cd340363dc84c7"
            } as SurveyTodoModel,
            {
                survey: "5b531d15617b0c1fb0c73699",
                respondent: "5984342227cd340363dc84a9"
            } as SurveyTodoModel] as SurveyTodoModel[];

            SurveyDataController.createManySurveyTodo(orgID, surveysTodo)
                .then(() => SurveyTodoCollection(orgID).find({survey: "5b531d15617b0c1fb0c73699" }).lean().exec())
                .then((items: any) => {
                    chai.should().exist(items);
                    chai.expect(items).length(2)
                    done();
                })
        })
    });

    suite("getSurveyTodo", () => {
        test("Should be able to get a survey to do by its ID", (done) => {
            const id = "5b557a9d82b9a800d4e29954";
            const userID = "5984342227cd340363dc84ae";

            SurveyDataController.getSurveyTodo(orgID, id, userID)
                .then((surveyTodo: any) => {
                    chai.should().exist(surveyTodo);
                    chai.expect(surveyTodo).have.property('surveyTodo');
                    chai.expect(String(surveyTodo.surveyTodo._id)).to.be.equal(id);
                    chai.expect(surveyTodo).have.property('questions');
                    chai.expect(surveyTodo.surveyTodo).have.property('_id');
                    chai.expect(surveyTodo.surveyTodo).have.property('survey');
                    chai.expect(surveyTodo.surveyTodo).have.property('respondent');
                    chai.expect(surveyTodo.surveyTodo).have.property('isCompleted');

                    if (surveyTodo.surveyTodo && surveyTodo.surveyTodo.isCompleted && surveyTodo.surveyTodo.isCompleted===true) {
                        chai.expect(surveyTodo.surveyTodo).have.property('manager');
                        chai.expect(surveyTodo.surveyTodo).not.empty(surveyTodo.surveyTodo.manager);
                    }

                    chai.expect(surveyTodo.questions).to.be.an.instanceOf(Array);

                    done();
                })
        });

        test("Should be throw PLenuumError if survey todo not exist", (done) => {
            const id = "5b557a9d82b9a800d4e2995g";
            const userID = "5984342227cd340363dc84ae";

            SurveyDataController.getSurveyTodo(orgID, id, userID)
                .then((surveyTodo: any) => {
                    done(new Error('This case getSurveyTodo should throw an error.'));
                })
                .catch((error : PlenuumError) => {
                    chai.expect(error.message).to.be.equal("Survey to do was not found");
                    done();
                });
        });

        test("Should be possible to get only your survey to do", (done) => {
            const id = "5b557a9d82b9a800d4e29954";
            const userID = "5984342227cd340363dc84ah";

            SurveyDataController.getSurveyTodo(orgID, id, userID)
                .then((surveyTodo: any) => {
                    done(new Error('This case getSurveyTodo should throw an error.'));
                })
                .catch((error : PlenuumError) => {
                    chai.expect(error.message).to.be.equal("Survey to do was not found");
                    done();
                });
        });
    });

    suite("saveSurveyTodo", () => {
        test("Should be able to complete an existing survey to do", (done) => {
            const surveyTodoId = "5b557a9d82b9a800d4e29950";
            const userID = "5984342227cd340363dc84ac";

            let surveyTodo : any = {
                _id: surveyTodoId,
                manager: "5984342227cd340363dc84c7",
                isCompleted: true,
                answers: [{
                    question:"5b5081c3aa357227f44fa503",
                    questionText:"Survey 1 Question 1",
                    answerText:"Answer 1 by liam.harris@example.com",
                    required:true,
                    min:10,
                    max:250
                },
                {
                    question:"5b5081c3aa357227f44fa504",
                    questionText:"Survey 1 Question 2",
                    answerText:"Answer 2 by liam.harris@example.com",
                    required:true,
                    min:null,
                    max:75
                },
                {
                    question:"5b5081c3aa357227f44fa505",
                    questionText:"Survey 1 Question 3",
                    answerText:"Answer 3 by liam.harris@example.com",
                    required:false,
                    min:5,
                    max:null
                }]
            };

            SurveyDataController.saveSurveyTodo(orgID, surveyTodo)
            .then(() => SurveyTodoCollection(orgID).findById(surveyTodoId).lean().exec())
            .then((item : any) => {
                chai.should().exist(item);
                chai.expect(item).have.property('completedAt');
                done();
            })
            .catch((error : Error) => {
                done(new Error('This case saveSurveyTodo should throw an error: ' + error.message));
            });
        })
    });

    suite("findManager", () => {
        test("Should be able to search manager for survey to do", async () => {
            const keyword = "ma";

            let result = await SurveyDataController.findManager(orgID, keyword);
            chai.should().exist(result);
            chai.expect(result).length(4);
        });
    });

    suite("setManager", () => {
        test("Should be able to set manager for survey to do", async () => {
            const surveyTodoId = "5b557a9d82b9a800d4e29950";
            const managerId = "5984342227cd340363dc84c7";

            let result : any = await SurveyDataController.setSurveyTodoManager(orgID, surveyTodoId, managerId);
            chai.should().exist(result);
            chai.expect(result).have.property('manager');
            chai.expect(result.manager).to.be.equal(managerId);
        });
    });

});