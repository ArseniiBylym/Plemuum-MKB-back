import { fixtureLoader, resetPassword, testUser } from "../mock/fixture.loader";
import * as request from "supertest";
import { createApp } from "../../app";
import * as responseValidator from "../../util/model.validator";
import { expect } from 'chai';
import { getDatabaseManager } from "../../factory/database.factory";
import config from "../../../config/config";

suite("Session request tests", () => {

    before(async () => {
        await getDatabaseManager(config.mongoUrl).openConnection();
        await fixtureLoader();
    });

    after(async () => await getDatabaseManager().closeConnection());

    suite("Login/Logout tests", () => {
        const url = "/api/session";

        test("Login with valid credentials, should get 200", async () => {
            const response = await request(createApp())
                .post(url)
                .query({email: testUser.email, password: "asd1234"})
                .expect(200);
            responseValidator.validateLoginResponse(response.body);
        });

        test("Login with invalid credentials, should get 401", async () => {
            await request(createApp())
                .post(url)
                .query({email: testUser.email, password: 'qwerty'})
                .expect(401);
        });

        test("Should be able to log out, return 200", async () => {
            await request(createApp())
                .delete(url)
                .expect(200);
        });
    });

    suite("Check token request", () => {
        const url = "/api/session/validtoken";
        test("Should be able to check if a token is valid", async () => {
            const token = await resetPassword(testUser._id);
            const response = await request(createApp())
                .post(url)
                .send({token: token})
                .expect(200);
            expect(response.body).to.haveOwnProperty("validToken");
            expect(response.body).to.haveOwnProperty("reseted");
        });
    })
});