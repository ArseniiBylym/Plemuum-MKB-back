import { expect } from 'chai';
import * as request from 'request';
import { RequestResponse } from 'request';
import config from '../../../config/config'

const orgId = "orgID1234";
const userId = "userID1234"


describe("Feedback request test", () => {

    const url = `http://localhost:${config.port}/api/${orgId}/user/${userId}/feedbacks`;

    describe("get feedbacks for user", () => {
        it("should return 200", done => {
            request.get(url, (error: any, response: RequestResponse) => {
                expect(response.statusCode).to.equal(200);
                done();
            })
        })

        it("response should contain userId and orgId", (done) => {
            request.get(url, (error: any, response: RequestResponse, body: any) => {
                const parsedBody = JSON.parse(body);
                expect(parsedBody).have.property("orgId");
                expect(parsedBody).have.property("userId");
                done();
            })
        })
    });

    describe("create a feedback for a user", () => {

        const url = `http://localhost:${config.port}/api/${orgId}/feedback`;

        it("should return 200", done => {
            request.post(url, (error: any, response: RequestResponse) => {
                expect(response.statusCode).to.equal(200);
                done();
            })
        })

        it("response should contain a feedback object", (done) => {
            request.post(url, (error: any, response: RequestResponse, body: any) => {
                const parsedBody = JSON.parse(body);
                expect(parsedBody).have.property("senderId");
                expect(parsedBody).have.property("recipientId");
                expect(parsedBody).have.property("context");
                expect(parsedBody).have.property("message");
                expect(parsedBody).have.property("privacy");
                expect(parsedBody).have.property("type");
                expect(parsedBody).have.property("requestId");
                expect(parsedBody).have.property("tags");

                done();
            })
        });
    })

});