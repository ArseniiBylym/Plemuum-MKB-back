import { getDatabaseManager } from "../../factory/database.factory";
import config from "../../../config/config";
import * as request from 'supertest';
import { authenticate, fixtureLoader, testUser } from "../mock/fixture.loader";
import app from "../../app";
import { basicAuthHeader, bearerAuthHeader } from "../header.helper";
import { expect, should } from 'chai';
import Skill from "../../data/models/organization/compass/skill.model";

const orgId = 'hipteam';

suite("Compass request test", () => {

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

    suite("Generate Todo", () => {

        const url = `/api/${orgId}/compasstodo`;

        test("Should be able to get a fresh todo", done => {
            authenticate(testUser)
                .then(token => {
                    request(app)
                        .post(url)
                        .send({recipientId: "5984342227cd340363dc84ac", senderId: "5984342227cd340363dc84b3"})
                        .set(bearerAuthHeader(token))
                        .expect(200)
                        .then(response => {
                            should().exist(response.body);
                            expect(response.body).to.haveOwnProperty("_id");
                            expect(response.body).to.haveOwnProperty("recipient");
                            expect(response.body).to.haveOwnProperty("createdBy");
                            expect(response.body).to.haveOwnProperty("questions");
                            expect(response.body.questions).to.be.instanceof(Array);
                            expect(response.body.questions).to.have.lengthOf(3);
                            expect(response.body.questions[0]).to.haveOwnProperty("sentence");
                            expect(response.body.questions[0]).to.haveOwnProperty("skill");
                            done();
                        })
                        .catch((err) => done(err));
                });
        });

        test("Should get user error if user does not exist with the given ID", done => {
            authenticate(testUser)
                .then(token => {
                    // That recipientId does not exist in the mock user list
                    request(app)
                        .post(url)
                        .send({recipientId: "5984342227cd340363dd84ae", senderId: "5984342227cd340363dc84b3"})
                        .set(bearerAuthHeader(token))
                        .expect(400)
                        .then(response => {
                            should().exist(response.body);
                            expect(response.body).to.haveOwnProperty("error");
                            expect(response.body.error).to.be.equal('User could not be found');
                            done();
                        })
                        .catch((err) => done(err));
                });
        });

        test("Should get organization error if organization does not exist", done => {
            const urlWhatever = `/api/whatever/compasstodo`;
            authenticate(testUser)
                .then(token => {
                    request(app)
                        .post(urlWhatever)
                        .send({recipientId: "5984342227cd340363dd84ac", senderId: "5984342227cd340363dc84b3"})
                        .set(bearerAuthHeader(token))
                        .expect(400)
                        .then(response => {
                            should().exist(response.body);
                            expect(response.body).to.haveOwnProperty("error");
                            expect(response.body.error).to.be.equal('Organization nonexistent!');
                            done();
                        }).catch((err) => done(err));
                });
        })
    });

    suite("Answer todo", () => {
        const url = `/api/${orgId}/compassanswers`;

        test("Should be able to send an answer, should get 200", async () => {
            const token = await authenticate(testUser);
            const response = await request(app).post(url).send({
                compassTodo: "1234",
                sender: "4321",
                sentencesAnswer: [
                    {
                        answer: "AGREE",
                        sentence: {
                            _id: "599c073b9745c80bc9ee6a65",
                            message: "message"
                        },
                        skill: {
                            _id: "599c073b9745c80bc9ee6a63",
                            name: "skill name",
                            sentences: [{
                                _id: "599c073b9745c80bc9ee6a65",
                                message: "message"
                            }],
                            inactiveSentences: []
                        }
                    }
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
        const url = `/api/create/skill/${orgId}`;
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
            const response = await request(app)
                .post(url)
                .set(basicAuthHeader)
                .send(newSkill)
                .expect(201);

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
            const response = await request(app)
                .post(url)
                .set(basicAuthHeader)
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
            const response = await request(app)
                .post(url)
                .set(basicAuthHeader)
                .send(newSkill)
                .expect(400);

            expect(response.body).to.haveOwnProperty("error");
            expect(response.body).to.haveOwnProperty("hint");
            expect(response.body.error).to.be.equal("Validation error");
        })
    })
});