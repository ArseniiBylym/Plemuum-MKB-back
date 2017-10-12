import { assert, expect } from 'chai';
import {getDatabaseManager} from "../../factory/database.factory";
import config from "../../../config/config";
import { authenticate, fixtureLoader, testAdmin, testUser } from "../mock/fixture.loader";
import * as request from 'supertest';
import app from "../../app";
import { bearerAuthHeader } from "../util/header.helper";
import * as TestObjectFactory from "../../util/testobject.factory"
import * as modelValidator from "../../util/model.validator"

suite("Notification request test", () => {

    before((done) => {
        getDatabaseManager().openConnection(config.mongoUrl)
            .then(() => fixtureLoader())
            .then(value => done())
            .catch((error) => {
                console.error(error);
                done();
            })
    });

    suite("Happy cases", () => {

        beforeEach(async () => {

        });

        test("Add a notification token that do not exist", async () => {
            const url =  '/api/users/me/notification';
            const token = await authenticate(testUser);
            const response = await request(app)
                .post(url)
                .send(TestObjectFactory.getTestNotificationToken())
                .set(bearerAuthHeader(token))
                .expect(200);
            modelValidator.validateNotificationTokenResponse(response.body, "message");
        });

        test("Remove an existing notification token", async () => {
            const url =  '/api/users/me/notification';
            const token = await authenticate(testUser);

            const postResponse = await request(app)
                .post(url)
                .send(TestObjectFactory.getTestNotificationToken())
                .set(bearerAuthHeader(token))
                .expect(200);
            modelValidator.validateNotificationTokenResponse(postResponse.body, "message");

            const deleteResponse = await request(app)
                .delete(url)
                .send(TestObjectFactory.getTestNotificationToken())
                .set(bearerAuthHeader(token))
                .expect(200);
            modelValidator.validateNotificationTokenResponse(deleteResponse.body, "message");
        });
    });

    suite("Sad cases", () => {

        test("Add a notification token when it already exists", async () => {
            const url =  '/api/users/me/notification';
            const token = await authenticate(testUser);

            const response1 = await request(app)
                .post(url)
                .send(TestObjectFactory.getTestNotificationToken())
                .set(bearerAuthHeader(token))
                .expect(200);
            modelValidator.validateNotificationTokenResponse(response1.body, "message");

            const response2 = await request(app)
                .post(url)
                .send(TestObjectFactory.getTestNotificationToken())
                .set(bearerAuthHeader(token))
                .expect(409);
            modelValidator.validateNotificationTokenResponse(response2.body, "error");
        });

        test("Remove a notification token that do not exist", async () => {
            const url =  '/api/users/me/notification';
            const token = await authenticate(testUser);

            const response1 = await request(app)
                .delete(url)
                .send(TestObjectFactory.getTestNotificationToken())
                .set(bearerAuthHeader(token))
                .expect(404);
            modelValidator.validateNotificationTokenResponse(response1.body, "error");
        });

    });

});