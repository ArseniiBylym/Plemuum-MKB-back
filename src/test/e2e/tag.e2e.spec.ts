import * as request from 'supertest';
import app from "../../app";
import { assert, expect } from 'chai';
import { authenticate, fixtureLoader, testUser } from "../mock/fixture.loader";
import * as modelValidator from "../../util/model.validator";
import { getDatabaseManager } from "../../factory/database.factory";
import config from "../../../config/config";
import { basicAuthHeader, bearerAuthHeader } from "../util/header.helper";

suite("Tag request tests", () => {

    before(async () => {
        await getDatabaseManager().openConnection(config.mongoUrl);
        await fixtureLoader();
    });

    after(async () => await getDatabaseManager().closeConnection());

    suite("New Tag", () => {
        const orgId = 'hipteam';
        const url = `/api/${orgId}/tag`;

        test("POST: should return 201", async () => {
            const response = await request(app)
                .post(url)
                .set(basicAuthHeader)
                .send({ title: "TestTagTitle" })
                .expect(201);
            modelValidator.validateTagResponse(response.body);
        });

        test("POST: should not be able to post a tag with an already existing title", async () => {
            const response = await request(app)
                .post(url)
                .set(basicAuthHeader)
                .send({ title: "TestTitle" })
                .expect(405);
            expect(response.body).to.haveOwnProperty("error");
            expect(response.body.error).to.be.equal("This tag already exists");
        })
    });

    suite("Get tags", () => {
        const orgId = 'hipteam';
        const url = `/api/${orgId}/tags`;
        test("Response should contain an array and return 200", async () => {
            const token = await authenticate(testUser)
            const response = await request(app)
                .get(url)
                .set(bearerAuthHeader(token))
                .expect(200);
            expect(response.body).to.be.an.instanceOf(Array);
            assert(response.body.length > 0);
            modelValidator.validateTagResponse(response.body[0]);
        })
    })
});