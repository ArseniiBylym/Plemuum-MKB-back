import { createApp } from '../../app';
import { assert, expect } from 'chai';
import * as request from 'supertest';
import * as TestObjectFactory from "../../util/testobject.factory"
import * as modelValidator from "../../util/model.validator"
import { adminAuthenticate, authenticate, fixtureLoader, resetPassword, testUser } from "../mock/fixture.loader"
import { getDatabaseManager } from "../../factory/database.factory";
import config from "../../../config/config";
import { bearerAuthHeader } from "../util/header.helper";

suite("User request tests", () => {

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

    suite('Get my team users', () => {
        const orgId = "hipteam";
        const url = `/api/organizations/${orgId}/myTeam/users`;

        test("GET: Correct request response should contain a users and return 200", done => {
            authenticate(testUser)
            .then(token => {
                request(createApp())
                    .get(url)
                    .set(bearerAuthHeader(token))
                    .expect(200)
                    .then(response => {
                        expect(response.body).to.be.an.instanceOf(Array);
                        assert(response.body.length >= 1, "Check if there's at least one element in the response array");
                        done();
                    });
            });
        });
    });

    suite("Get user's feedbacks in excel file", () => {
        
        test("GET: Should return 422 with error message 'Unprocessable Entity' ", done => {
            authenticate(testUser)
            .then(token => {
                request(createApp())
                    .get("/api/organizations/hipteam/wrongUserId/feedbacks/excel")
                    .set(bearerAuthHeader(token))
                    .expect(422)
                    .end(function (err, res){
                        if (err) done(err);
                    })
                    done();
            });
        });
    });

    suite("Get user's number of feedbacks and skillscores", () => {
        const orgId = "hipteam";
        const url = `/api/organizations/${orgId}/${testUser._id}/numberOfPublicFeedbacksAndSkillScores`;

        test('Response should return an object and status 200', done => {
            authenticate(testUser)
                .then(token => {
                    request(createApp())
                        .get(url)
                        .set(bearerAuthHeader(token))
                        .expect(200)
                        .then(response => {
                            expect(response.body).to.haveOwnProperty('numberOfpublicFeedback');
                            expect(response.body).to.haveOwnProperty('numberOfSkillScores');
                        })
                        .then(done,done);
                });
        })
    });

    suite('Create new user', () => {
        const url = `/api/users`;

        test("POST: Correct request response should contain a user and return 201", async () => {
            const token = await adminAuthenticate();
            const response = await request(createApp())
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
                    request(createApp())
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
                    request(createApp())
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
            request(createApp())
                .post(url)
                .send({email: testUser.email})
                .expect(200, done())
        });
    });

    suite('Set password', () => {
        const url = `/api/session/set-password`;

        test('Should return 200 with a success message', async () => {
            const token = await resetPassword(testUser._id);
            const response = await request(createApp())
                .post(url)
                .send({token: token, newPassword: "newPass"})
                .expect(200);
            expect(response.body).to.haveOwnProperty("successMessage");
        });
    });

    suite('Change password', () => {
        const url = `/api/session/password`;

        test('Should return 200', done => {
            request(createApp())
                .post(url)
                .send({
                    email: testUser.email,
                    password: "asd1234",
                    newPassword: "321dsa",
                })
                .expect(200, done);
        });
    });
});