import * as request from 'supertest';
import app from "../../app";
import { assert, expect } from 'chai';
import * as modelValidator from "../../util/model.validator"
import Request from "../../data/models/organization/request.model";
import { authenticate, fixtureLoader, testUser } from "../mock/fixture.loader";
import { getDatabaseManager } from "../../factory/database.factory";
import config from "../../../config/config";
import { bearerAuthHeader } from "../util/header.helper";

const orgId = "hipteam";
const userId = testUser._id;
const requestId = "59844c1cd0b5d006da3c961d";

suite("Request entity related request tests", () => {

    before(async () => {
        await getDatabaseManager().openConnection(config.mongoUrl);
        await fixtureLoader();
    });

    after(async () => await getDatabaseManager().closeConnection());

    suite("Create new request", () => {
        const url = `/api/${orgId}/requests`;

        test("Should be able to post a request", async () => {
            const requestForm = {
                recipientId: ['5984342227cd340363dc84ac'],
                requestMessage: 'Message'
            };

            const token = await authenticate(testUser);
            const response = await request(app)
                .post(url)
                .set(bearerAuthHeader(token))
                .send(requestForm)
                .expect(201);
            modelValidator.validateRequest(response.body);
        });

        test("Should return 400 and error object if body is incorrect", async () => {
            const incorrectRequestForm = {
                senderId: "sender",
                requestMessage: 'Message'
            };
            const token = await authenticate(testUser);
            const response = await request(app)
                .post(url)
                .set(bearerAuthHeader(token))
                .send(incorrectRequestForm)
                .expect(400);
            modelValidator.validateError(response.body);
        })
    });

    suite("Get all request for user", () => {
        const url = `/api/${orgId}/requests`;

        test("Should be able to get all request for user", async () => {
            const token = await authenticate(testUser);
            const response = await request(app)
                .get(url)
                .set(bearerAuthHeader(token))
                .expect(200);
            expect(response.body).to.be.an.instanceOf(Array);
            assert(response.body.length >= 1, "Check if there's at least one element in the response array");
            response.body.forEach((requestObj: Request) => {
                modelValidator.validateRequest(requestObj);
            });
        });
    });

    suite("Get user's sent requests", () => {
        const url = `/api/${orgId}/requests/sender`;

        test("Should be able to get user's sent requests", async () => {
            const token = await authenticate(testUser);
            const response = await request(app)
                .get(url)
                .set(bearerAuthHeader(token))
                .expect(200);
            expect(response.body).to.be.an.instanceOf(Array);
            assert(response.body.length >= 1, "Check if there's at least one element in the response array");
            response.body.forEach((requestObj: Request) => {
                modelValidator.validateRequest(requestObj);
                assert(requestObj.senderId === userId, 'senderId should be the same as the userId')
            });
        })
    });

    suite("Get user's received requests", () => {
        const url = `/api/${orgId}/requests/recipient`;
        test("Should be able to get user's received requests", async () => {
            const token = await authenticate(testUser);
            const response = await request(app)
                .get(url)
                .set(bearerAuthHeader(token))
                .expect(200);
            expect(response.body).to.be.an.instanceOf(Array);
            assert(response.body.length >= 1, "Check if there's at least one element in the response array");
            response.body.forEach((requestObj: Request) => {
                modelValidator.validateRequest(requestObj);
                assert(requestObj.recipientId.indexOf(userId) !== -1, 'senderId should be the same as the userId')
            });
        })
    });

    suite("Get a single request", () => {
        const url = `/api/${orgId}/requests/${requestId}`;
        test("Should be able to get a single request", async () => {
            const token = await authenticate(testUser);
            const response = await request(app)
                .get(url)
                .set(bearerAuthHeader(token))
                .expect(200);
            modelValidator.validateRequest(response.body);
            assert(response.body._id === requestId, "request's id should match with the url param id");
        });
    });

    suite("Get the recipients of a request", () => {
        const url = `/api/${orgId}/requests/${requestId}/recipients`;
        test("Should be able to get the recipients of a request", async () => {
            const token = await authenticate(testUser);
            const response = await request(app)
                .get(url)
                .set(bearerAuthHeader(token))
                .expect(200);
            expect(response.body).to.be.an.instanceOf(Array);
            assert(response.body.length >= 1, "Check if there's at least one element in the response array");
            response.body.forEach((user: any) => {
                modelValidator.validateUser(user);
            });
        });
    });
});