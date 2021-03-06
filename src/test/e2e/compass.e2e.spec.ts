import { getDatabaseManager } from "../../factory/database.factory";
import config from "../../../config/config";
import * as request from 'supertest';
import { adminAuthenticate, authenticate, fixtureLoader, testUser } from "../mock/fixture.loader";
import { createApp } from "../../app";
import { basicAuthHeader, bearerAuthHeader } from "../util/header.helper";
import { expect, should } from 'chai';
import Skill from "../../data/models/organization/compass/skill.model";
import { ANSWER_TYPES } from "../../data/models/organization/compass/compassanswer.model";

const orgId = 'hipteam';

suite("Compass request test", () => {

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

    suite("Generate Todo", () => {

        const url = `/api/organizations/${orgId}/compass/todos`;

        test("Should be able to get a fresh todo", async () => {
            const token = await authenticate(testUser);
            const response = await request(createApp())
                .post(url)
                .send({aboutUserId: "5984342227cd340363dc84c7"})
                .set(bearerAuthHeader(token))
                .expect(200);

            should().exist(response.body);
            expect(response.body).to.haveOwnProperty("about");
            expect(response.body).to.haveOwnProperty("owner");
            expect(response.body.questions).to.be.instanceof(Array);
            expect(response.body.questions).to.have.lengthOf(3);
            expect(response.body.questions[0]).to.haveOwnProperty("sentence");
            expect(response.body.questions[0]).to.haveOwnProperty("skill");
        });

        test("Should get user error if user does not exist with the given ID", async () => {
            const token = await authenticate(testUser);
            // That recipientId does not exist in the mock user list
            const response = await request(createApp())
                .post(url)
                .send({aboutUserId: "5984342227cd340363dd84ae"})
                .set(bearerAuthHeader(token))
                .expect(404);

            should().exist(response.body);
            expect(response.body).to.haveOwnProperty("error");
            expect(response.body.error).to.be.equal('User could not be found');
        });
    });

    suite("Answer todo", () => {
        const url = `/api/organizations/${orgId}/compass/answers`;

        test("Should be able to send an answer, should get 200", async () => {
            const token = await authenticate(testUser);
            const response = await request(createApp()).post(url).send({
                compassTodo: "599e89e390adc5039fbc285b",
                sender: "5984342227cd340363dc84af",
                sentencesAnswer: [
                    {
                        answer: ANSWER_TYPES.AGREE,
                        sentence: {
                            message: "Its willing to admit own mistakes",
                            _id: "599e88721a6ec6039715b541"
                        },
                        skill: {
                            _id: "5940f5f44d0d550007d863dc",
                            name: "Integrity",
                            inactiveSentences: [],
                            sentences: [
                                {
                                    message: "Takes responsibility for own decisions and behavior.",
                                    _id: "599e88721a6ec6039715b542"
                                },
                                {
                                    message: "Its willing to admit own mistakes",
                                    _id: "599e88721a6ec6039715b541"
                                },
                                {
                                    message: "Questions practices which might violate rules of fairness.",
                                    _id: "599e88721a6ec6039715b540"
                                }
                            ]
                        }
                    },
                    {
                        answer: ANSWER_TYPES.AGREE,
                        sentence: {
                            message: "Supports the development of their colleagues. Gives frequent, detailed feedback.",
                            _id: "599e88721a6ec6039715b544"
                        },
                        skill: {
                            _id: "5940f6044d0d550007d863df",
                            name: "Performance Management",
                            inactiveSentences: [],
                            sentences: [
                                {
                                    message: "Defines clear and measurable objectives.",
                                    _id: "599e88721a6ec6039715b546"
                                },
                                {
                                    message: "Recognize great performance.",
                                    _id: "599e88721a6ec6039715b545"
                                },
                                {
                                    message: "Supports the development of their colleagues. Gives frequent, detailed feedback.",
                                    _id: "599e88721a6ec6039715b544"
                                },
                                {
                                    message: "Supports the develment of their colleagues.",
                                    _id: "599e88721a6ec6039715b543"
                                }
                            ]
                        }
                    },
                    {
                        answer: ANSWER_TYPES.DISAGREE,
                        sentence: {
                            message: "Supports the develment of their colleagues.",
                            _id: "599e88721a6ec6039715b543"
                        },
                        skill: {
                            _id: "5940f6044d0d550007d863df",
                            name: "Performance Management",
                            inactiveSentences: [],
                            sentences: [
                                {
                                    message: "Defines clear and measurable objectives.",
                                    _id: "599e88721a6ec6039715b546"
                                },
                                {
                                    message: "Recognize great performance.",
                                    _id: "599e88721a6ec6039715b545"
                                },
                                {
                                    message: "Supports the development of their colleagues. Gives frequent, detailed feedback.",
                                    _id: "599e88721a6ec6039715b544"
                                },
                                {
                                    message: "Supports the develment of their colleagues.",
                                    _id: "599e88721a6ec6039715b543"
                                }
                            ]
                        }
                    },
                ]
            }).set(bearerAuthHeader(token)).expect(200);
            const answer = response.body;
            expect(answer).to.haveOwnProperty("compassTodo");
            expect(answer).to.haveOwnProperty("sender");
            expect(answer).to.haveOwnProperty("sentencesAnswer");

            expect(answer.sentencesAnswer[0]).to.haveOwnProperty("answer");
            expect(answer.sentencesAnswer[0]).to.haveOwnProperty("skill");
            expect(answer.sentencesAnswer[0]).to.haveOwnProperty("sentence");

        })
    });

    suite("Create new skill", () => {
        const url = `/api/organizations/${orgId}/skills`;
        const newSkill: Skill = {
            name: "New Skill",
            sentences: [
                {
                    message: "First sentence"
                }
            ],
            inactiveSentences: []
        };

        test("Should be able to create a new skill, it should return 201 and the created skill object", async () => {
            const token = await adminAuthenticate();
            const response = await request(createApp())
                .patch(url)
                .set(bearerAuthHeader(token))
                .send(newSkill)
                .expect(200);

            expect(response.body).to.haveOwnProperty('name');
            expect(response.body).to.haveOwnProperty('sentences');
            expect(response.body).to.haveOwnProperty('inactiveSentences');

            expect(response.body.sentences).to.be.instanceof(Array);
            expect(response.body.sentences).to.have.lengthOf(1);
            expect(response.body.sentences[0]).to.haveOwnProperty('message');

            expect(response.body.inactiveSentences).to.be.instanceof(Array);
            expect(response.body.inactiveSentences).to.have.lengthOf(0);

        });

        test("Should get and error with status 400 if request body is empty", async () => {
            const token = await adminAuthenticate();
            const response = await request(createApp())
                .patch(url)
                .set(bearerAuthHeader(token))
                .expect(400);

            expect(response.body).to.haveOwnProperty("error");
            expect(response.body).to.haveOwnProperty("hint");
            expect(response.body.error).to.be.equal("Validation error");
        });

        test("Should get and error with status 400 if there's no sentence in the array", async () => {
            const newSkill: Skill = {
                name: "New Skill",
                sentences: [],
                inactiveSentences: []
            };
            const token = await adminAuthenticate();
            const response = await request(createApp())
                .patch(url)
                .set(bearerAuthHeader(token))
                .send(newSkill)
                .expect(400);

            expect(response.body).to.haveOwnProperty("error");
            expect(response.body).to.haveOwnProperty("hint");
            expect(response.body.error).to.be.equal("Validation error");
        })
    });

    suite("Update existing skill", () => {
        const url = `/api/organizations/${orgId}/skills`;
        test("Should be able to upload and update a skill, should return the updated skill and 200", async () => {
            const newSkill = {
                _id: "5940f5f44d0d550007d863dc",
                name: "Integrity",
                inactiveSentences: [
                    {
                        message: "Questions practices which might violate rules of fairness.",
                        _id: "599d3d95e8e27b04f2f05f55"
                    }
                ],
                sentences: [
                    {
                        message: "Takes responsibility for own decisions and behavior.",
                        _id: "599d3d95e8e27b04f2f05f57"
                    },
                    {
                        message: "Its willing to admit own mistakes",
                        _id: "599d3d95e8e27b04f2f05f56"
                    },
                ]
            };
            const token = await adminAuthenticate();
            const response = await request(createApp())
                .patch(url)
                .set(bearerAuthHeader(token))
                .send(newSkill)
                .expect(200);
            expect(response.body.name).to.be.deep.equal(newSkill.name);
            expect(response.body.inactiveSentences.length).to.be.equal(newSkill.inactiveSentences.length);
            expect(response.body.sentences.length).to.be.equal(newSkill.sentences.length);
        });

    });

    suite("Trigger for todo generation", () => {
        test("Generate todos for users in the organizations", async () => {
            const orgId = "hipteam";
            const url = `/api/organizations/${orgId}/compass/todos/generate`;
            const result = {"message": "TODOs were generated successfully"};
            const token = await adminAuthenticate();
            const response = await request(createApp())
                .post(url)
                .set(bearerAuthHeader(token))
                .expect(200);
            expect(response.body).to.be.deep.equal(result);
        });
    });
});