import { assert, expect } from 'chai';
import * as request from 'supertest';
import * as TestObjectFactory from "../../util/testobject.factory"
import app from '../../app';
import { fixtureLoader } from "../mock/fixture.loader";
import * as modelValidator from "../../util/model.validator"
import Feedback from "../../data/models/feedback.model";

const orgId = "hipteam";
const userId = "5984342227cd340363dc84c2";

suite("Feedback request test", () => {

    before((done) => {
        fixtureLoader()
            .then(value => done())
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
                    modelValidator.validateFeedback(response.body);
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
                    modelValidator.validateError(response.body);
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
                    modelValidator.validateError(response.body);
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
                    response.body.forEach((feedback: Feedback) => {
                        assert(feedback.senderId === userId, 'senderId should be the same as the userId')
                    });
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
                    response.body.forEach((feedback: Feedback) => {
                        assert(feedback.recipientId === userId, 'recipientId should be the same as the userId')
                    });
                    done();
                });
        })
    });

});