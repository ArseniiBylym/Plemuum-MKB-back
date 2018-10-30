import * as request from 'supertest';
import { createApp } from "../../app";
import { authenticate, fixtureLoader, testUser } from "../mock/fixture.loader";
import { getDatabaseManager } from "../../factory/database.factory";
import config from "../../../config/config";
import { bearerAuthHeader } from "../util/header.helper";
import * as chai from 'chai';
import * as TestObjectFactory from "../../util/testobject.factory"

const orgId = "hipteam";
const surveyType = "2";
const userId = testUser._id;

suite("Survey request test", () => {
    before(async () => {
        await getDatabaseManager(config.mongoUrl).openConnection();
        await fixtureLoader();
    });

    after(async () => await getDatabaseManager().closeConnection());

    suite("CreateSurvey", () => {
        const url = `/api/organizations/${orgId}/surveys/${surveyType}`;

        test("Create survey current user", async () => {
            const token = await authenticate(testUser);
            const response = await request(createApp())
                .post(url)
                .set(bearerAuthHeader(token))
                .send(TestObjectFactory.getTestSurvey())
                .expect(200)
                chai.expect(response.body).to.haveOwnProperty('_id');
        });
    });

    suite("CreateSurveyError", () => {
        const url = `/api/organizations/${orgId}/surveys/${surveyType}`;

        test("Create survey without title", async () => {
            const token = await authenticate(testUser);
            const survey = TestObjectFactory.getTestSurvey();
            survey.title = null;
            const response = await request(createApp())
                .post(url)
                .set(bearerAuthHeader(token))
                .send(survey)
                .expect(400)
        });
    });

    suite("getSurveyDetail", () => {
        const url = `/api/organizations/${orgId}/survey/${surveyType}/5bc74b228401444bf3c8e32d/detail`;

        test("Should be able to get survey detail", async () => {
            const token = await authenticate(testUser);
            const response = await request(createApp())
                .get(url)
                .set(bearerAuthHeader(token))
                .expect(200)
                chai.expect(response.body.complitedSurveyTodos).to.be.equal(1);
                chai.expect(response.body.respondents).to.be.an.instanceOf(Array);
        });
    });

    suite("getSurveyTemplates", () => {
        const url = `/api/organizations/${orgId}/surveys/surveyTemplate/${surveyType}`;

        test("Get survey temlates", async () => {
            const token = await authenticate(testUser);
            const response = await request(createApp())
                .get(url)
                .set(bearerAuthHeader(token))
                .expect(200)
                chai.expect(response.body).to.be.an.instanceOf(Array);
                chai.assert(response.body.length >= 1, "Check if there's at least one element in the response array")
        });
    });

    suite("CreateSurveyTemplate", () => {
        const url = `/api/organizations/${orgId}/surveys/surveyTemplate/${surveyType}`;

        test("Create new survey template", async () => {
            const token = await authenticate(testUser);
            const survey = TestObjectFactory.getTestSurvey();
            const surveyTemplate = survey;
            surveyTemplate.templateTitle = "Survey template title";
            surveyTemplate.visible = ["all"];
            survey.respondents = null;
            const response = await request(createApp())
                .post(url)
                .set(bearerAuthHeader(token))
                .send(surveyTemplate)
                .expect(200)

        });
    });

    suite("DeleteSurveyTemplate", () => {
        const url = `/api/organizations/${orgId}/surveys/surveyTemplate/${surveyType}`;

        test("Delete survey template", async () => {
            const token = await authenticate(testUser);
            const surveyTemplateId = {surveyTemplateId: "5bd72f2155303f4efd2c98b6"};
            const response = await request(createApp())
                .delete(url)
                .set(bearerAuthHeader(token))
                .send(surveyTemplateId)
                .expect(200)
        });
    });

    suite("getAllSurveysTodo", () => {
        const url = `/api/organizations/${orgId}/surveysTodo`;

        test("Should be able to get all surveys to do list for current user", async () => {
            const token = await authenticate(testUser);
            const response = await request(createApp())
                .get(url)
                .set(bearerAuthHeader(token))
                .expect(200);
                chai.expect(response.body[0]).haveOwnProperty("_id");
        });
    });

    suite("getSurveyTodo", () => {
        const id ="5b557a9d82b9a800d4e29953";
        const badId = "5b557a9d82b9a800d4e29959";
        const url = `/api/organizations/${orgId}/surveysTodo/${id}`;
        const badUrl = `/api/organizations/${orgId}/surveysTodo/${badId}`;

        test("Should be able to get survey to do by Id for current user", async () => {
            const token = await authenticate(testUser);
            const response = await request(createApp())
                .get(url)
                .set(bearerAuthHeader(token))
                .expect(200);

            chai.should().exist(response.body);
            chai.assert(response.body.surveyTodo._id === id, "survey to do's id should match with the url param id");
        });

        test("Should be able to return 404 if survey to do does not exist", async () => {
            const token = await authenticate(testUser);
            const response = await request(createApp())
                .get(badUrl)
                .set(bearerAuthHeader(token))
                .expect(404);

                chai.should().exist(response.body);
                chai.expect(response.body).to.haveOwnProperty('error');
        });
    });

    suite("saveSurveyTodo", () => {
        const id ="5b557a9d82b9a800d4e29953";
        const url = `/api/organizations/${orgId}/surveysTodo/${id}`;

        test("Should be able to complete survey to do by Id", async () => {
            let surveyTodo : any = {
                _id: id,
                isCompleted: true,
                answers: [{
                    "question":"5bc74b228401444bf3c8e32e",
                    "questionText":"Survey 2 Question 2",
                    "questionType": "text",
                    "answerText":"Answer 2 by sheryl.grant@hipteam.io",
                    "required":true,
                    "min":5,
                    "max":75
                }]
            };

            const token = await authenticate(testUser);
            const response = await request(createApp())
                .patch(url)
                .set(bearerAuthHeader(token))
                .send(surveyTodo)
                .expect(200);
        });
    });

    suite("findManager", () => {
        const keyword = "ma";
        const url = `/api/organizations/${orgId}/surveys/search/manager?q=${keyword}`;

        test("Should be able to search manager for survey to do", async () => {
            const token = await authenticate(testUser);
            const response = await request(createApp())
                .get(url)
                .set(bearerAuthHeader(token))
                .expect(200);

            chai.expect(response.body).to.be.an.instanceOf(Array);
        });
    });

});