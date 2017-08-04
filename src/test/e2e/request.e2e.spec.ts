import * as request from 'supertest';
import app from "../../app";
import * as DataControllerFactory from '../../factory/datacontroller.factory';
import { assert, expect } from 'chai';
import * as modelValidator from "../../util/model.validator"
import Request from "../../data/models/request.model";
import { User } from "../../data/models/user.model";

const orgId = "hipteam";
const userId = "5984342227cd340363dc84ac";
const requestId = "59844c1cd0b5d006da3c9620";

suite("Request entity related request tests", () => {

    before((done) => {
        DataControllerFactory.getRequestDataController().clearData(orgId)
            .then((state) => done())
            .catch((error) => {
                console.error(error);
                done();
            })
    });

    suite("Create new request", () => {
        const url = `/api/${orgId}/request`;

        test("Should be able to post a request", done => {
            const requestForm = {
                senderId: "sender",
                recipientId: ['first'],
                requestMessage: 'Message'
            };

            request(app)
                .post(url)
                .send(requestForm)
                .expect(200)
                .then(response => {
                    modelValidator.validateRequest(response.body);
                    done();
                });
        });

        test("Should return 400 and error object if body is incorrect", done => {
            const incorrectRequestForm = {
                senderId: "sender",
                requestMessage: 'Message'
            };
            request(app)
                .post(url)
                .send(incorrectRequestForm)
                .expect(400)
                .then(response => {
                    modelValidator.validateError(response.body);
                    done();
                });

        })
    });

    suite("Get all request for user", () => {
        const url = `/api/${orgId}/user/${userId}/requests`;

        test("Should be able to get all request for user", done => {
            request(app)
                .get(url)
                .expect(200)
                .then(response => {
                    expect(response.body).to.be.an.instanceOf(Array);
                    response.body.forEach((requestObj: Request) => {
                        modelValidator.validateRequest(requestObj);
                    });
                    done();
                });
        })
    });

    suite("Get user's sent requests", () => {
        const url = `/api/${orgId}/user/${userId}/requests/sender`;

        test("Should be able to get user's sent requests", done => {
            request(app)
                .get(url)
                .expect(200)
                .then(response => {
                    expect(response.body).to.be.an.instanceOf(Array);
                    response.body.forEach((requestObj: Request) => {
                        modelValidator.validateRequest(requestObj);
                        assert(requestObj.senderId === userId, 'senderId should be the same as the userId')
                    });
                    done();
                });
        })
    });

    suite("Get user's received requests", () => {
        const url = `/api/${orgId}/user/${userId}/requests/recipient`;

        test("Should be able to get user's received requests", done => {
            request(app)
                .get(url)
                .expect(200)
                .then(response => {
                    expect(response.body).to.be.an.instanceOf(Array);
                    response.body.forEach((requestObj: Request) => {
                        modelValidator.validateRequest(requestObj);
                        assert(requestObj.recipientId.indexOf(userId) !== -1, 'senderId should be the same as the userId')
                    });
                    done();
                });
        })
    });

    suite("Get a single request", () => {
        const url = `/api/${orgId}/user/${userId}/requests/${requestId}`;

        test("Should be able to get a single request", done => {
            request(app)
                .get(url)
                .expect(200)
                .then(response => {
                    modelValidator.validateRequest(response.body);
                    assert(response.body._id === requestId, "request's id should match with the url param id");
                    done();
                });
        })
    });

    suite("Get the recipients of a request", () => {
        const url = `/api/${orgId}/user/${userId}/requests/${requestId}/recipients`;

        test("Should be able to get the recipients of a request", done => {
            request(app)
                .get(url)
                .expect(200)
                .then(response => {
                    expect(response.body).to.be.an.instanceOf(Array);
                    response.body.forEach((user: User) => {
                        modelValidator.validateUser(user);
                    });
                    done();
                });
        })
    });
});