import { expect } from 'chai';
import * as request from 'request';
import { RequestResponse } from 'request';
import config from '../../../config/config'
import * as DataControllerFactory from '../../factory/datacontroller.factory';
import * as TestObjectFactory from "../../util/testobject.factory"

const orgId = "orgID1234";
const userId = "userID1234";
const baseUrl = `http://localhost:${config.port}/api`;

describe("Feedback request test", () => {

    before((done) => {
        DataControllerFactory.getFeedbackDataController().clearData()
            .then((state) => done())
            .catch((error) => {
                console.error(error);
                done();
            })
    });

    describe("Fetch feedbacks", () => {
        const url = `${baseUrl}/${orgId}/user/${userId}/feedbacks`;

        it("should return 200", done => {
            request.get(url, (error: any, response: RequestResponse) => {
                expect(response.statusCode).to.equal(200);
                done();
            })
        });

        it("response should be an array", (done) => {
            request.get(url, (error: any, response: RequestResponse, body: any) => {
                const parsedBody = JSON.parse(body);
                expect(parsedBody).to.be.an.instanceOf(Array);
                done();
            })
        })
    });

    describe("Create a feedback", () => {
        const url = `${baseUrl}/${orgId}/feedback`;
        const feedbackForm = {
            form: TestObjectFactory.getTestFeedback()
        };

        it("should return 200", done => {
            request.post(url, feedbackForm, (error: any, response: RequestResponse) => {
                expect(response.statusCode).to.equal(200);
                done();
            })
        });

        it("response should contain a feedback object", (done) => {
            request.post(url, feedbackForm, (error: any, response: RequestResponse, body: any) => {
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
    });

    describe("Create a feedback without form", () => {
        const url = `${baseUrl}/${orgId}/feedback`;
        const feedbackForm = {};

        it("should return 400 Bad Request", done => {
            request.post(url, feedbackForm, (error: any, response: RequestResponse) => {
                expect(response.statusCode).to.equal(400);
                done();
            })
        });

        it("response should contain an error object", (done) => {
            request.post(url, feedbackForm, (error: any, response: RequestResponse, body: any) => {
                const parsedBody = JSON.parse(body);
                expect(parsedBody).have.property("errorName");
                expect(parsedBody).have.property("message");
                done();
            })
        });

    });

    describe("Create a feedback with invalid form", () => {
        const url = `${baseUrl}/${orgId}/feedback`;
        const feedbackForm = {
            form: {
                senderId: 'senderId',
                recipientId: 'recipientId',
                context: 'context',
                creationDate: '2017.07.31.',
                privacy: ['ANONYMOS'],
                type: 'CONSIDER',
                requestId: '',
                tags: []
            }
        };

        it("should return 400 Bad Request", done => {
            request.post(url, feedbackForm, (error: any, response: RequestResponse) => {
                expect(response.statusCode).to.equal(400);
                done();
            })
        });

        it("response should contain an error object", (done) => {
            request.post(url, feedbackForm, (error: any, response: RequestResponse, body: any) => {
                const parsedBody = JSON.parse(body);
                expect(parsedBody).have.property("errorName");
                expect(parsedBody).have.property("message");
                done();
            })
        });

    });

    describe("Fetch sent feedbacks", () => {
        const url = `${baseUrl}/${orgId}/user/${userId}/feedbacks/sent`;

        it("should return 200", done => {
            request.get(url, (error: any, response: RequestResponse) => {
                expect(response.statusCode).to.equal(200);
                done();
            })
        });

        it("response should be an array", (done) => {
            request.get(url, (error: any, response: RequestResponse, body: any) => {
                const parsedBody = JSON.parse(body);
                expect(parsedBody).to.be.an.instanceOf(Array);
                done();
            })
        })
    });

    describe("Fetch incoming feedbacks", () => {

        const url = `${baseUrl}/${orgId}/user/${userId}/feedbacks/incoming`;

        it("should return 200", done => {
            request.get(url, (error: any, response: RequestResponse) => {
                expect(response.statusCode).to.equal(200);
                done();
            })
        });

        it("response should be an array", (done) => {
            request.get(url, (error: any, response: RequestResponse, body: any) => {
                const parsedBody = JSON.parse(body);
                expect(parsedBody).to.be.an.instanceOf(Array);
                done();
            })
        })
    });

});