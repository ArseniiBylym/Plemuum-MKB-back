import * as request from 'supertest';
import { createApp } from "../../app";
import { assert, expect } from 'chai';
import { adminAuthenticate, authenticate, fixtureLoader, testUser } from "../mock/fixture.loader";
import * as modelValidator from "../../util/model.validator";
import { getDatabaseManager } from "../../factory/database.factory";
import config from "../../../config/config";
import { bearerAuthHeader } from "../util/header.helper";

suite("Tag request tests", () => {

    before(async () => {
        await getDatabaseManager(config.mongoUrl).openConnection();
        await fixtureLoader();
    });

    after(async () => await getDatabaseManager().closeConnection());

    suite("New Tag", () => {
        const orgId = 'hipteam';
        const url = `/api/organizations/${orgId}/tags`;

        test("POST: should return 201", async () => {
            const token = await adminAuthenticate();
            const response = await request(createApp())
                .post(url)
                .set(bearerAuthHeader(token))
                .send({title: "TestTagTitle"})
                .expect(201);
            modelValidator.validateTagResponse(response.body);
        });

        test("POST: should not be able to post a tag with an already existing title", async () => {
            const token = await adminAuthenticate();
            const response = await request(createApp())
                .post(url)
                .set(bearerAuthHeader(token))
                .send({title: "TestTitle"})
                .expect(405);
            expect(response.body).to.haveOwnProperty("error");
            expect(response.body.error).to.be.equal("This tag already exists");
        })
    });

    suite("Get tags", () => {
        const orgId = 'hipteam';
        const url = `/api/organizations/${orgId}/tags`;
        test("Response should contain an array and return 200", async () => {
            const token = await authenticate(testUser);
            const response = await request(createApp())
                .get(url)
                .set(bearerAuthHeader(token))
                .expect(200);
            expect(response.body).to.be.an.instanceOf(Array);
            assert(response.body.length > 0);
            modelValidator.validateTagResponse(response.body[0]);
        })
    })
});