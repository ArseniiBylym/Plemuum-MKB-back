import * as request from 'supertest';
import app from "../../app";
import * as DataControllerFactory from '../../factory/datacontroller.factory';
import { expect } from 'chai';

const orgId = "hipteam";
const userId = "5982d890157abf05724b9b7a";
const requestId = "requestId";

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
                    expect(response.body).have.property("senderId");
                    expect(response.body).have.property("recipientId");
                    expect(response.body).have.property("requestMessage");
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
                    expect(response.body).have.property("errorName");
                    expect(response.body).have.property("message");
                    done();
                });

        })
    });

    describe("Get all request for user", () => {
        const url = `/api/${orgId}/user/${userId}/requests`;

        test("Should be able to get all request for user", done => {
            request(app)
                .get(url)
                .expect(200, done);
        })
    });

    describe("Get user's sent requests", () => {
        const url = `/api/${orgId}/user/${userId}/requests/sender`;

        test("Should be able to get user's sent requests", done => {
            request(app)
                .get(url)
                .expect(200, done);
        })
    });

    describe("Get user's received requests", () => {
        const url = `/api/${orgId}/user/${userId}/requests/recipient`;

        test("Should be able to get user's received requests", done => {
            request(app)
                .get(url)
                .expect(200, done);
        })
    });

    describe("Get a single request", () => {
        const url = `/api/${orgId}/user/${userId}/requests/${requestId}`;

        test("Should be able to get a single request", done => {
            request(app)
                .get(url)
                .expect(200, done);
        })
    });

    describe("Get the recipients of a request", () => {
        const url = `/api/${orgId}/user/${userId}/requests/${requestId}/recipients`;

        test("Should be able to get the recipients of a request", done => {
            request(app)
                .get(url)
                .expect(200, done);
        })
    });
});