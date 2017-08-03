import * as request from 'supertest';
import app from "../../app";

const orgId = "hipteam";
const userId = "5982d890157abf05724b9b7a";
const requestId = "requestId";

suite("Request entity related request tests", () => {

    suite("Create new request", () => {

        const url = `/api/${orgId}/request`;

        it("Should be able to post a request", done => {
            request(app)
                .post(url)
                .send({})
                .expect(200, done);
        })
    });

    describe("Get all request for user", () => {
        const url = `/api/${orgId}/user/${userId}/requests`;

        it("Should be able to get all request for user", done => {
            request(app)
                .get(url)
                .expect(200, done);
        })
    });

    describe("Get user's sent requests", () => {
        const url = `/api/${orgId}/user/${userId}/requests/sender`;

        it("Should be able to get user's sent requests", done => {
            request(app)
                .get(url)
                .expect(200, done);
        })
    });

    describe("Get user's received requests", () => {
        const url = `/api/${orgId}/user/${userId}/requests/recipient`;

        it("Should be able to get user's received requests", done => {
            request(app)
                .get(url)
                .expect(200, done);
        })
    });

    describe("Get a single request", () => {
        const url = `/api/${orgId}/user/${userId}/requests/${requestId}`;

        it("Should be able to get a single request", done => {
            request(app)
                .get(url)
                .expect(200, done);
        })
    });

    describe("Get the recipients of a request", () => {
        const url = `/api/${orgId}/user/${userId}/requests/${requestId}/recipients`;

        it("Should be able to get the recipients of a request", done => {
            request(app)
                .get(url)
                .expect(200, done);
        })
    });
});