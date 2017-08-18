import { getDatabaseManager } from "../../factory/database.factory";
import config from "../../../config/config";
import * as request from 'supertest';
import { authenticate, fixtureLoader, testUser } from "../mock/fixture.loader";
import app from "../../app";
import { bearerAuthHeader } from "../header.helper";
import { expect, assert, should } from 'chai';

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
                            expect(response.body).to.haveOwnProperty("recipientId");
                            expect(response.body).to.haveOwnProperty("sender");
                            expect(response.body).to.haveOwnProperty("message");
                            expect(response.body).to.haveOwnProperty("sentences");
                            expect(response.body.sentences).to.be.instanceof(Array);
                            expect(response.body.sentences).to.have.lengthOf(3);
                            expect(response.body.sentences[0]).to.haveOwnProperty("message");
                            expect(response.body.sentences[0]).to.haveOwnProperty("skillName");
                            expect(response.body.sentences[0]).to.haveOwnProperty("_id");
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
});