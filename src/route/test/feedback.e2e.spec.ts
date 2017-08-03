import { expect } from 'chai';
import * as request from 'supertest';
import * as DataControllerFactory from '../../factory/datacontroller.factory';
import * as TestObjectFactory from "../../util/testobject.factory"
import app from '../../app';

const orgId = "hipteam";
const userId = "userID1234";

suite("Feedback request test", () => {

    before((done) => {
        DataControllerFactory.getFeedbackDataController().clearData(orgId)
            .then((state) => done())
            .catch((error) => {
                console.error(error);
                done();
            })
    });

    suite("Fetch feedbacks", () => {
        const url = `/api/${orgId}/user/${userId}/feedbacks`;

        test("response should be an array and return 200", (done) => {
            request(app)
                .get(url)
                .expect(200)
                .then(response => {
                    expect(response.body).to.be.an.instanceOf(Array);
                    done();
                });
        })
    });

    suite("Create a feedback", () => {
        const url = `/api/${orgId}/feedback`;

        test("response should contain a feedback object and return 200", (done) => {
            request(app)
                .post(url)
                .send(TestObjectFactory.getTestFeedback())
                .expect(200)
                .then(response => {
                    expect(response.body).have.property("senderId");
                    expect(response.body).have.property("recipientId");
                    expect(response.body).have.property("context");
                    expect(response.body).have.property("message");
                    expect(response.body).have.property("privacy");
                    expect(response.body).have.property("type");
                    expect(response.body).have.property("requestId");
                    expect(response.body).have.property("tags");
                    done();
                });
        });
    });

    suite("Create a feedback without form", () => {
        const url = `/api/${orgId}/feedback`;
        const feedbackForm = {};

        test("response should contain an error object and return 400", (done) => {
            request(app)
                .post(url)
                .send(feedbackForm)
                .expect(400)
                .then(response => {
                    expect(response.body).have.property("errorName");
                    expect(response.body).have.property("message");
                    done();
                });
        });

    });

    suite("Create a feedback with invalid form", () => {
        const url = `/api/${orgId}/feedback`;
        const feedbackForm = {
            senderId: 'senderId',
            recipientId: 'recipientId',
            context: 'context',
            creationDate: '2017.07.31.',
            privacy: ['ANONYMOS'],
            type: 'CONSIDER',
            requestId: '',
            tags: []
        };

        test("response should contain an error object and return 400", (done) => {
            request(app)
                .post(url)
                .send(feedbackForm)
                .expect(400)
                .then(response => {
                    expect(response.body).have.property("errorName");
                    expect(response.body).have.property("message");
                    done();
                });
        });

    });

    suite("Fetch sent feedbacks and return 200", () => {
        const url = `/api/${orgId}/user/${userId}/feedbacks/sent`;

        test("response should be an array", (done) => {
            request(app)
                .get(url)
                .expect(200)
                .then(response => {
                    expect(response.body).to.be.an.instanceOf(Array);
                    done();
                });
        })
    });

    suite("Fetch incoming feedbacks and return 200", () => {
        const url = `/api/${orgId}/user/${userId}/feedbacks/incoming`;

        test("response should be an array", (done) => {
            request(app)
                .get(url)
                .expect(200)
                .then(response => {
                    expect(response.body).to.be.an.instanceOf(Array);
                    done();
                });
        })
    });

});