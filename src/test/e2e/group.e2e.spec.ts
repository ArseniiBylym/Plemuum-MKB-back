import { getDatabaseManager } from "../../factory/database.factory";
import config from "../../../config/config";
import { authenticate, fixtureLoader, testUser } from "../mock/fixture.loader";
import * as request from 'supertest';
import app from "../../app";
import { basicAuthHeader } from "../header.helper";
import { fail } from "assert";
import { validateGroup } from "../../util/model.validator";
import { getTestGroup } from "../../util/testobject.factory";


suite("Group request test", () => {

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

    test("Should be able to create a group, response should contain a group object, return 201", done => {
        const orgId = "hipteam";
        const url = `/api/${orgId}/groups`;

        authenticate(testUser)
            .then(token => {
                request(app)
                    .post(url)
                    .send(getTestGroup())
                    .set(basicAuthHeader)
                    .expect(201)
                    .then(response => {
                        validateGroup(response.body);
                        done();
                    })
                    .catch((err) => {
                        fail(err);
                        done();
                    });
            });
    });
});