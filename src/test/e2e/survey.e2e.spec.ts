import * as request from 'supertest';
import { createApp } from "../../app";
import { authenticate, fixtureLoader, testUser } from "../mock/fixture.loader";
import { getDatabaseManager } from "../../factory/database.factory";
import config from "../../../config/config";
import { bearerAuthHeader } from "../util/header.helper";
import * as chai from 'chai';

const orgId = "hipteam";
const userId = testUser._id;

suite("Survey request test", () => {
    before(async () => {
        await getDatabaseManager(config.mongoUrl).openConnection();
        await fixtureLoader();
    });

    after(async () => await getDatabaseManager().closeConnection());

    suite("getAllSurveysTodo", () => {
        const url = `/api/organizations/${orgId}/surveysTodo`;

        test("Should be able to get all surveys to do list for current user", async () => {
            const token = await authenticate(testUser);
            const response = await request(createApp())
                .get(url)
                .set(bearerAuthHeader(token))
                .expect(200);

            chai.expect(response.body).to.be.an.instanceOf(Array);
        });
    });

    suite("getSurveyTodo", () => {
        const id ="5b557a9d82b9a800d4e29955";
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
        const id ="5b557a9d82b9a800d4e29955";
        const url = `/api/organizations/${orgId}/surveysTodo/${id}`;

        test("Should be able to complete survey to do by Id", async () => {
            let surveyTodo : any = {
                _id: id,
                manager: "5984342227cd340363dc84c7",
                isCompleted: true,
                answers: [{
                    "question":"5b5081c3aa357227f44fa507",
                    "questionText":"Survey 2 Question 2",
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