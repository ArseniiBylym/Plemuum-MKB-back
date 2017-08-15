import { getDatabaseManager } from "../../factory/database.factory";
import config from "../../../config/config";
import { authenticate, fixtureLoader, testUser } from "../mock/fixture.loader";
import * as request from 'supertest';
import app from "../../app";
import { basicAuthHeader, bearerAuthHeader } from "../header.helper";
import { fail } from "assert";
import { validateGroup } from "../../util/model.validator";
import { getTestGroup } from "../../util/testobject.factory";
import { expect, should } from 'chai';

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

    const orgId = "hipteam";
    test("Should be able to create a group, response should contain a group object, return 201", done => {
        const url = `/api/${orgId}/groups`;

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

    test("Should be able to get a group by its id", done => {
        const groupID = "599312971b31d008b6bd2781";
        const url = `/api/${orgId}/groups/${groupID}`;

        authenticate(testUser)
            .then((token) => {
                request(app)
                    .get(url)
                    .send(getTestGroup())
                    .set(bearerAuthHeader(token))
                    .expect(200)
                    .then(response => {
                        should().exist(response.body);
                        validateGroup(response.body);
                        expect(response.body._id.toString()).to.be.equal(groupID);
                        done();
                    })
                    .catch((err) => {
                        fail(err);
                        done();
                    });
            })
    });

    test("Should be able to get all groups a user participates in", done => {

        const userID = "5984342227cd340363dc84af";
        const url = `/api/${orgId}/groups/user/${userID}`;

        authenticate(testUser)
            .then((token) => {
                request(app)
                    .get(url)
                    .send(getTestGroup())
                    .set(bearerAuthHeader(token))
                    .expect(200)
                    .then(response => {
                        should().exist(response.body);
                        expect(response.body).to.be.an.instanceof(Array);
                        response.body.forEach((group: any) => validateGroup(group));
                        done();
                    })
                    .catch((err) => {
                        fail(err);
                        done();
                    });
            })
    })
});