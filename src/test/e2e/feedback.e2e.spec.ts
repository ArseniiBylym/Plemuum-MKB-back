import { assert, expect } from 'chai';
import * as request from 'supertest';
import * as TestObjectFactory from "../../util/testobject.factory"
import app from '../../app';
import { authenticate, fixtureLoader, testUser } from "../mock/fixture.loader";
import * as modelValidator from "../../util/model.validator"
import Feedback from "../../data/models/organization/feedback.model";
import { getDatabaseManager } from "../../factory/database.factory";
import config from "../../../config/config";
import { bearerAuthHeader } from "../util/header.helper";

const orgId = "hipteam";
const userId = testUser._id;

suite("Feedback request test", () => {

    before(async () => {
        await getDatabaseManager().openConnection(config.mongoUrl);
        await fixtureLoader();
    });

    after(async () => await getDatabaseManager().closeConnection());

    suite("Fetch feedbacks", () => {
        const url = `/api/organizations/${orgId}/users/me/feedbacks`;

        test("response should be an array and return 200", async () => {
            const token = await authenticate(testUser);
            const response = await request(app)
                .get(url)
                .set(bearerAuthHeader(token))
                .expect(200);
            expect(response.body).to.be.an.instanceOf(Array);
            assert(response.body.length >= 1, "Check if there's at least one element in the response array");
        });
    });

    suite("Create a feedback", () => {
        const url = `/api/organizations/${orgId}/feedbacks`;

        test("response should contain a feedback object and return 201", async () => {
            const token = await authenticate(testUser);
            const response = await request(app)
                .post(url)
                .set(bearerAuthHeader(token))
                .send(TestObjectFactory.getTestFeedback())
                .expect(201);
            modelValidator.validateFeedback(response.body);
        });
    });

    suite("Create a feedback without form", () => {
        const url = `/api/organizations/${orgId}/feedbacks`;
        const feedbackForm = {};

        test("response should contain an error object and return 400", async () => {
            const token = await authenticate(testUser);
            const response = await request(app)
                .post(url)
                .set(bearerAuthHeader(token))
                .send(feedbackForm)
                .expect(400);
            modelValidator.validateError(response.body);
        });
    });

    suite("Create a feedback with invalid form", () => {
        const url = `/api/organizations/${orgId}/feedbacks`;
        const feedbackForm = {
            senderId: 'senderId',
            recipientId: 'recipientId',
            context: 'context',
            creationDate: '2017.07.31.',
            privacy: ['ANONYMOS'],
            type: 'CONSIDER',
            requestId: '',
            tags: []
        };

        test("response should contain an error object and return 400", async () => {
            const token = await authenticate(testUser);
            const response = await request(app)
                .post(url)
                .set(bearerAuthHeader(token))
                .send(feedbackForm)
                .expect(400);
            modelValidator.validateError(response.body);
        });
    });

    suite("Fetch sent feedbacks and return 200", () => {
        const url = `/api/organizations/${orgId}/users/me/feedbacks/sent`;

        test("response should be an array", async () => {
            const token = await authenticate(testUser);
            const response = await request(app)
                .get(url)
                .set(bearerAuthHeader(token))
                .expect(200);
            expect(response.body).to.be.an.instanceOf(Array);
            assert(response.body.length >= 1, "Check if there's at least one element in the response array");
            response.body.forEach((feedback: Feedback) =>
                assert(feedback.senderId === userId, 'senderId should be the same as the userId')
            );
        })
    });

    suite("Fetch incoming feedbacks and return 200", () => {
        const url = `/api/organizations/${orgId}/users/me/feedbacks/received`;

        test("response should be an array", async () => {
            const token = await authenticate(testUser);
            const response = await request(app)
                .get(url)
                .set(bearerAuthHeader(token))
                .expect(200);
            expect(response.body).to.be.an.instanceOf(Array);
            assert(response.body.length >= 1, "Check if there's at least one element in the response array");
            response.body.forEach((feedback: Feedback) =>
                assert(feedback.recipientId === userId, 'recipientId should be the same as the userId')
            );
        })
    });
});