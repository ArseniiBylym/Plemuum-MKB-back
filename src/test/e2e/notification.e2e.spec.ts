import { getDatabaseManager } from "../../factory/database.factory";
import config from "../../../config/config";
import { authenticate, fixtureLoader, testUser } from "../mock/fixture.loader";
import * as request from 'supertest';
import { createApp } from "../../app";
import { bearerAuthHeader } from "../util/header.helper";
import * as TestObjectFactory from "../../util/testobject.factory"
import * as modelValidator from "../../util/model.validator"

suite("Notification request test", () => {

    before((done) => {
        getDatabaseManager(config.mongoUrl).openConnection()
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
            const url = '/api/users/me/notification';
            const token = await authenticate(testUser);
            const response = await request(createApp())
                .post(url)
                .send(TestObjectFactory.getTestNotificationToken())
                .set(bearerAuthHeader(token))
                .expect(200);
            modelValidator.validateNotificationTokenResponse(response.body, "message");
        });

        test("Remove an existing notification token", async () => {
            const url = '/api/users/me/notification';
            const token = await authenticate(testUser);

            const postResponse = await request(createApp())
                .post(url)
                .send(TestObjectFactory.getTestNotificationToken())
                .set(bearerAuthHeader(token))
                .expect(200);
            modelValidator.validateNotificationTokenResponse(postResponse.body, "message");

            const deleteResponse = await request(createApp())
                .delete(url)
                .send(TestObjectFactory.getTestNotificationToken())
                .set(bearerAuthHeader(token))
                .expect(200);
            modelValidator.validateNotificationTokenResponse(deleteResponse.body, "message");
        });
    });

    suite("Sad cases", () => {

        test("Add a notification token when it already exists", async () => {
            const url = '/api/users/me/notification';
            const token = await authenticate(testUser);

            const response1 = await request(createApp())
                .post(url)
                .send(TestObjectFactory.getTestNotificationToken())
                .set(bearerAuthHeader(token))
                .expect(200);
            modelValidator.validateNotificationTokenResponse(response1.body, "message");

            const response2 = await request(createApp())
                .post(url)
                .send(TestObjectFactory.getTestNotificationToken())
                .set(bearerAuthHeader(token))
                .expect(200);
            modelValidator.validateNotificationTokenResponse(response2.body, "message");
        });

        test("Remove a notification token that do not exist", async () => {
            const url = '/api/users/me/notification';
            const token = await authenticate(testUser);

            const response1 = await request(createApp())
                .delete(url)
                .send(TestObjectFactory.getTestNotificationToken())
                .set(bearerAuthHeader(token))
                .expect(404);
            modelValidator.validateNotificationTokenResponse(response1.body, "error");
        });

    });

});