import app from '../../app';
import { assert, expect } from 'chai';
import * as request from 'supertest';
import * as TestObjectFactory from "../../util/testobject.factory"
import * as modelValidator from "../../util/model.validator"
import { authenticate, fixtureLoader, resetPassword, testUser } from "../mock/fixture.loader"
import { getDatabaseManager } from "../../factory/database.factory";
import config from "../../../config/config";
import { basicAuthHeader, bearerAuthHeader } from "../util/header.helper";

suite("User request tests", () => {

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

    suite('Create new user', () => {
        const url = `/api/users`;

        test("POST: Correct request response should contain a user and return 201", async () => {
            const token = await authenticate(testUser);
            const response = await request(app)
                .post(url)
                .set(bearerAuthHeader(token))
                .send(TestObjectFactory.getRegisterJohnDoe())
                .expect(201);
            modelValidator.validateUser(response.body);
        });
    });

    suite('Get all users from organization', () => {
        const orgId = "hipteam";
        const url = `/api/organizations/${orgId}/users`;

        test('Response should return an array of users and status 200', done => {
            authenticate(testUser)
                .then(token => {
                    request(app)
                        .get(url)
                        .set(bearerAuthHeader(token))
                        .expect(200)
                        .then(response => {
                            expect(response.body).to.be.an.instanceOf(Array);
                            assert(response.body.length >= 1, "Check if there's at least one element in the response array");
                            done();
                        });
                });
        })
    });

    suite('Get one user from organization', () => {
        const orgId = "hipteam";
        const userId = "5984342227cd340363dc84ab";
        const url = `/api/organizations/${orgId}/users/${userId}`;

        test('Should return 200', done => {
            authenticate(testUser)
                .then(token => {
                    request(app)
                        .get(url)
                        .set(bearerAuthHeader(token))
                        .expect(200)
                        .then(response => {
                            const user = response.body;
                            modelValidator.validateUser(user);
                            expect(user._id).to.be.equal(userId);
                            done();
                        }).catch((err) => done(err));
                });
        });
    });

    suite.skip('Reset user password', () => {
        const url = `/api/resetPassword`;
        test('Should return 200', done => {
            request(app)
                .post(url)
                .send({ email: testUser.email })
                .expect(200, done())
        });
    });

    suite('Set password', () => {
        const url = `/api/setPassword`;

        test('Should return 200 with a success message', async () => {
            const token = await resetPassword(testUser._id);
            const response = await request(app)
                .post(url)
                .send({ token: token, newPassword: "newPass" })
                .expect(200);
            expect(response.body).to.haveOwnProperty("successMessage");
        });
    });

    suite('Change password', () => {
        const url = `/api/user/password`;

        test('Should return 200', done => {
            request(app)
                .post(url)
                .send({
                    email: testUser.email,
                    password: testUser.password,
                    newPassword: "321dsa",
                })
                .expect(200, done);
        });
    });
});