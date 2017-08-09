import * as request from 'supertest';
import app from "../../app";
import { basicAuthHeader } from "../header.helper";
import { getTestOrganization } from "../../util/testobject.factory";
import { getDatabaseManager } from "../../factory/database.factory";
import { fixtureLoader } from "../mock/fixture.loader";
import config from "../../../config/config";
import { validateOrganization } from "../../util/model.validator";
import { expect } from 'chai';

suite("Organization request tests", () => {

    before((done) => {
        getDatabaseManager().openConnection(config.mongoUrl)
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
        const url = "/api/organization";
        test("GET: should return 200", done => {
            request(app)
                .get(url)
                .set(basicAuthHeader)
                .expect(200, done);
        });

        test("Register new organization, should return 200", done => {
            request(app)
                .post(url)
                .set(basicAuthHeader)
                .send(getTestOrganization())
                .expect(200)
                .then((response) => {
                    validateOrganization(response.body);
                    done();
                });
        });

        test("Register organization with reserved dbName, should return 400 and proper error message", done => {
            const newOrg = getTestOrganization();
            newOrg.dbName = "mockorganization";

            request(app)
                .post(url)
                .set(basicAuthHeader)
                .send(newOrg)
                .expect(400)
                .then((response) => {
                    expect(response.body).to.haveOwnProperty("error");
                    expect(response.body.error).to.be.string(
                        "The organization could not be added. Check if the dbName contains any forbidden character");
                    done();
                });
        })
    })
});