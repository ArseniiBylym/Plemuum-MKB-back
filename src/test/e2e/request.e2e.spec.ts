import * as request from 'supertest';
import app from "../../app";
import { assert, expect } from 'chai';
import * as modelValidator from "../../util/model.validator"
import Request from "../../data/models/organization/request.model";
import { authenticate, fixtureLoader, testUser } from "../mock/fixture.loader";
import { getDatabaseManager } from "../../factory/database.factory";
import config from "../../../config/config";
import { bearerAuthHeader } from "../header.helper";

const orgId = "hipteam";
const userId = "5984342227cd340363dc84ac";
const requestId = "59844c1cd0b5d006da3c9620";

suite("Request entity related request tests", () => {

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

    suite("Create new request", () => {
        const url = `/api/${orgId}/request`;

        test("Should be able to post a request", done => {
            const requestForm = {
                senderId: "sender",
                recipientId: ['first'],
                requestMessage: 'Message'
            };

            authenticate(testUser)
                .then(token => {
                    request(app)
                        .post(url)
                        .set(bearerAuthHeader(token))
                        .send(requestForm)
                        .expect(200)
                        .then(response => {
                            modelValidator.validateRequest(response.body);
                            done();
                        });
                });
        });

        test("Should return 400 and error object if body is incorrect", done => {
            const incorrectRequestForm = {
                senderId: "sender",
                requestMessage: 'Message'
            };
            authenticate(testUser)
                .then(token => {
                    request(app)
                        .post(url)
                        .set(bearerAuthHeader(token))
                        .send(incorrectRequestForm)
                        .expect(400)
                        .then(response => {
                            modelValidator.validateError(response.body);
                            done();
                        });
                });
        })
    });

    suite("Get all request for common", () => {
        const url = `/api/${orgId}/user/${userId}/requests`;

        test("Should be able to get all request for common", done => {
            authenticate(testUser)
                .then(token => {
                    request(app)
                        .get(url)
                        .set(bearerAuthHeader(token))
                        .expect(200)
                        .then(response => {
                            expect(response.body).to.be.an.instanceOf(Array);
                            assert(response.body.length >= 1, "Check if there's at least one element in the response array");
                            response.body.forEach((requestObj: Request) => {
                                modelValidator.validateRequest(requestObj);
                            });
                            done();
                        }).catch((err) => done(err));
                });
        })
    });

    suite("Get common's sent requests", () => {
        const url = `/api/${orgId}/user/${userId}/requests/sender`;

        test("Should be able to get common's sent requests", done => {
            authenticate(testUser)
                .then(token => {
                    request(app)
                        .get(url)
                        .set(bearerAuthHeader(token))
                        .expect(200)
                        .then(response => {
                            expect(response.body).to.be.an.instanceOf(Array);
                            assert(response.body.length >= 1, "Check if there's at least one element in the response array");
                            response.body.forEach((requestObj: Request) => {
                                modelValidator.validateRequest(requestObj);
                                assert(requestObj.senderId === userId, 'senderId should be the same as the userId')
                            });
                            done();
                        }).catch((err) => done(err));
                });
        })
    });

    suite("Get common's received requests", () => {
        const url = `/api/${orgId}/user/${userId}/requests/recipient`;
        test("Should be able to get common's received requests", done => {
            authenticate(testUser)
                .then(token => {
                    request(app)
                        .get(url)
                        .set(bearerAuthHeader(token))
                        .expect(200)
                        .then(response => {
                            expect(response.body).to.be.an.instanceOf(Array);
                            assert(response.body.length >= 1, "Check if there's at least one element in the response array");
                            response.body.forEach((requestObj: Request) => {
                                modelValidator.validateRequest(requestObj);
                                assert(requestObj.recipientId.indexOf(userId) !== -1, 'senderId should be the same as the userId')
                            });
                            done();
                        }).catch((err) => done(err));
                });
        })
    });

    suite("Get a single request", () => {
        const url = `/api/${orgId}/user/${userId}/requests/${requestId}`;
        test("Should be able to get a single request", done => {
            authenticate(testUser)
                .then(token => {
                    request(app)
                        .get(url)
                        .set(bearerAuthHeader(token))
                        .expect(200)
                        .then(response => {
                            modelValidator.validateRequest(response.body);
                            assert(response.body._id === requestId, "request's id should match with the url param id");
                            done();
                        }).catch((err) => done(err));
                });
        })
    });

    suite("Get the recipients of a request", () => {
        const url = `/api/${orgId}/user/${userId}/requests/${requestId}/recipients`;
        test("Should be able to get the recipients of a request", done => {
            authenticate(testUser)
                .then(token => {
                    request(app)
                        .get(url)
                        .set(bearerAuthHeader(token))
                        .expect(200)
                        .then(response => {
                            expect(response.body).to.be.an.instanceOf(Array);
                            assert(response.body.length >= 1, "Check if there's at least one element in the response array");
                            response.body.forEach((user: any) => {
                                modelValidator.validateUser(user);
                            });
                            done();
                        }).catch((err) => done(err));
                });
        })
    });
});