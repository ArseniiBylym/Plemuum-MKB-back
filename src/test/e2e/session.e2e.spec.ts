import { authenticate, fixtureLoader, resetPassword, testUser } from "../mock/fixture.loader";
import * as request from "supertest";
import app from "../../app";
import * as responseValidator from "../../util/model.validator";
import { expect } from 'chai';
import { getDatabaseManager } from "../../factory/database.factory";
import config from "../../../config/config";
import { bearerAuthHeader } from "../util/header.helper";

suite("Session request tests", () => {

    before(async () => {
        await getDatabaseManager().openConnection(config.mongoUrl);
        await fixtureLoader();
    });

    after(async () => await getDatabaseManager().closeConnection());

    suite("Login/Logout tests", () => {
        const url = "/api/session";

        test("Login with valid credentials, should get 200", async () => {
            const response = await request(app)
                .post(url)
                .query({ email: testUser.email, password: "asd1234" })
                .expect(200);
            responseValidator.validateLoginResponse(response.body);
        });

        test("Login with invalid credentials, should get 401", async () => {
            await request(app)
                .post(url)
                .query({ email: testUser.email, password: 'qwerty' })
                .expect(401);
        });

        test("Should be able to log out, return 200", async () => {
            const token = await authenticate(testUser);
            const response = await request(app)
                .delete(url)
                .set(bearerAuthHeader(token))
                .expect(200);
            expect(response.body).to.haveOwnProperty('message');
            expect(response.body.message).to.be.string("User logged out successfully");
        });

        test("Should get 401 if the token is invalid for logout", async () => {
            const token = await authenticate(testUser);
            const response = await request(app)
                .delete(url)
                .set('Authorization', `Bearer asd123`)
                .expect(401);
        });

        test("Should get 401 if there's no token in the header", async () => {
            await request(app)
                .delete(url)
                .expect(401);
        });
    });

    suite("Check token request", () => {
        const url = "/api/session/validtoken";
        test("Should be able to check if a token is valid", async () => {
            const token = await resetPassword(testUser._id);
            const response = await request(app)
                .post(url)
                .send({ token: token })
                .expect(200);
            expect(response.body).to.haveOwnProperty("validToken");
            expect(response.body).to.haveOwnProperty("reseted");
        });
    })
});