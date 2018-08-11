import * as request from 'supertest';
import { createApp } from "../../app";
import { bearerAuthHeader } from "../util/header.helper";
import { getTestOrganization } from "../../util/testobject.factory";
import { getDatabaseManager } from "../../factory/database.factory";
import { adminAuthenticate, fixtureLoader } from "../mock/fixture.loader";
import config from "../../../config/config";
import { validateOrganization } from "../../util/model.validator";
import { expect } from 'chai';

suite("Organization request tests", () => {

    before((done) => {
        getDatabaseManager(config.mongoUrl).openConnection()
            .then(() => fixtureLoader())
            .then(value => done())
            .catch((error) => {
                console.error(error);
                done();
            })
    });

    after(done => {
        getDatabaseManager().closeConnection()
            .then(() => done())
            .catch(() => done());
    });

    suite("Create organization", () => {
        const url = "/api/organizations";
        test("Register new organization, should return 201", async () => {
            const token = await adminAuthenticate();
            const response = await request(createApp())
                .post(url)
                .set(bearerAuthHeader(token))
                .send(getTestOrganization())
                .expect(201);
            validateOrganization(response.body);
        });

        test("Register organization with reserved dbName, should return 400 and proper error message", async () => {
            const newOrg = getTestOrganization();
            newOrg.dbName = "hipteam"; // this organization is part of the mocks

            const token = await adminAuthenticate();
            const response = await request(createApp())
                .post(url)
                .set(bearerAuthHeader(token))
                .send(newOrg)
                .expect(400);
            expect(response.body).to.haveOwnProperty("error");
            expect(response.body.error).to.be.string(
                "The organization could not be added. Check if the dbName contains any forbidden character");
        })
    })
});