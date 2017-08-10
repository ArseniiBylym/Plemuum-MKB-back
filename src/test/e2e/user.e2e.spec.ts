import app from '../../app';
import { assert, expect } from 'chai';
import * as request from 'supertest';
import UserDataController from "../../data/datacontroller/user.datacontroller";
import UserController from "../../controller/user.controller";
import * as TestObjectFactory from "../../util/testobject.factory"
import * as modelValidator from "../../util/model.validator"
import { authenticate, fixtureLoader, testUser } from "../mock/fixture.loader"
import { getDatabaseManager } from "../../factory/database.factory";
import config from "../../../config/config";
import { basicAuthHeader, bearerAuthHeader } from "../header.helper";

let userDataController: UserDataController;
let userController: UserController;

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

        const url = `/api/register/user`;

        test("POST: Correct request response should contain a user and return 201", done => {
            request(app)
                .post(url)
                .set(basicAuthHeader)
                .send(TestObjectFactory.getRegisterJohnDoe())
                .expect(201)
                .then(response => {
                    modelValidator.validateUser(response.body);
                    done();
                })
                .catch(reason => done(reason));
        });

        test('GET: Should return 200', done => {
            request(app)
                .get(url)
                .set(basicAuthHeader)
                .expect(200, done);
        });
    });
    suite('Get all users from organization', () => {
        const orgId = "hipteam";
        const url = `/api/${orgId}/users`;

        test('Response should return an array of users and status 200', done => {
            authenticate(testUser)
                .then(token => {
                    request(app)
                        .get(url)
                        .set(bearerAuthHeader(token))
                        .query({email: 'sheryl.grant@example.com', password: 'asd1234'})
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
        const url = `/api/${orgId}/user/${userId}`;

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
                        });
                });
        });
    });

    suite.skip('Reset user password', () => {
        const url = `/api/resetPassword`;
        test('Should return 200', done => {
            request(app)
                .post(url)
                .send({email: testUser.email})
                .expect(200, done())
        });
    });

    suite('Set password', () => {
        const url = `/api/setPassword`;

        test('Should send mail properly, return 200', done => {
            request(app)
                .post(url)
                .expect(200, done);
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
                    passwordAgain: "321dsa"
                })
                .expect(200, done);
        });
    });

    // TODO Finish this
    suite('Change user picture', () => {
        const url = `/api/profile/setpicture`;

        test('Should return 200', done => {
            authenticate(testUser)
                .then(token => {
                    request(app)
                        .post(url)
                        .set(bearerAuthHeader(token))
                        .expect(200, done);
                })
        });
    })
});