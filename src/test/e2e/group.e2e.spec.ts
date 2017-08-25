import { getDatabaseManager } from "../../factory/database.factory";
import config from "../../../config/config";
import { authenticate, fixtureLoader, testUser } from "../mock/fixture.loader";
import * as request from 'supertest';
import app from "../../app";
import { basicAuthHeader, bearerAuthHeader } from "../header.helper";
import { fail } from "assert";
import { validateGroup } from "../../util/model.validator";
import { getTestGroup } from "../../util/testobject.factory";
import { expect, should } from 'chai';

suite("Group request test", () => {

    const orgId = "hipteam";

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

    suite("Create group", () => {
        test("Should be able to create a group, response should contain a group object, return 201", done => {
            const url = `/api/${orgId}/groups`;

            request(app)
                .post(url)
                .send(getTestGroup())
                .set(basicAuthHeader)
                .expect(201)
                .then(response => {
                    validateGroup(response.body);
                    done();
                })
                .catch((err) => {
                    fail(err);
                    done();
                });
        });
    });

    suite("Get group by ID", () => {
        test("Should be able to get a group by its id", done => {
            const groupID = "599312971b31d008b6bd2781";
            const url = `/api/${orgId}/groups/${groupID}`;

            authenticate(testUser)
                .then((token) => {
                    request(app)
                        .get(url)
                        .send(getTestGroup())
                        .set(bearerAuthHeader(token))
                        .expect(200)
                        .then(response => {
                            should().exist(response.body);
                            validateGroup(response.body);
                            expect(response.body._id.toString()).to.be.equal(groupID);
                            done();
                        })
                        .catch((err) => {
                            fail(err);
                            done();
                        });
                })
        });
    });

    suite("Get groups for user", () => {
        test("Should be able to get all groups a user participates in", done => {

            const userID = "5984342227cd340363dc84af";
            const url = `/api/${orgId}/groups/user/${userID}`;

            authenticate(testUser)
                .then((token) => {
                    request(app)
                        .get(url)
                        .send(getTestGroup())
                        .set(bearerAuthHeader(token))
                        .expect(200)
                        .then(response => {
                            should().exist(response.body);
                            expect(response.body).to.be.an.instanceof(Array);
                            response.body.forEach((group: any) => validateGroup(group));
                            done();
                        })
                        .catch((err) => done(err));
                })
        });
    });

    suite("Put user into group", () => {
        test("Should be able to put a user in a group", done => {

            const userID = "5984342227cd340363dc84af";
            const groupID = "599312a81b31d008b6bd2783";
            const url = `/api/${orgId}/groups/${groupID}/user`;

            request(app)
                .post(url)
                .send({userId: userID})
                .set(basicAuthHeader)
                .expect(200)
                .then(response => {
                    should().exist(response.body);
                    expect(response.body).to.haveOwnProperty('success');
                    expect(response.body.success).to.be.equal("User has been added");
                    done();
                })
                .catch((err) => done(err));
        });

        test("Should not be able to put a user in a group if the user is already part of that group",
            async () => {

                const userID = "5984342227cd340363dc84b2";
                const groupID = "599312a31b31d008b6bd2782";
                const url = `/api/${orgId}/groups/${groupID}/user`;

                const response = await request(app)
                    .post(url)
                    .send({userId: userID})
                    .set(basicAuthHeader)
                    .expect(400);

                should().exist(response.body);
                expect(response.body).to.haveOwnProperty('error');
            })
    });

    suite("Remove user from group", () => {
        test("Should be able to remove a user from a group", async () => {

            const userID = "5984342227cd340363dc84c6";
            const groupID = "599312971b31d008b6bd2781";
            const url = `/api/${orgId}/groups/${groupID}/user`;

            const response = await request(app)
                .delete(url)
                .send({userId: userID})
                .set(basicAuthHeader)
                .expect(200);

            should().exist(response.body);
            expect(response.body).to.haveOwnProperty('success');
            expect(response.body.success).to.be.equal("User has been removed");
        });

        test("Should not be able to remove a user from a group if the user is not part of that group",
            done => {

                const userID = "5984342227cd340363dc84af";
                const groupID = "599312aa1b31d008b6bd2784";
                const url = `/api/${orgId}/groups/${groupID}/user`;

                request(app)
                    .delete(url)
                    .send({userId: userID})
                    .set(basicAuthHeader)
                    .expect(400)
                    .then(response => {
                        should().exist(response.body);
                        expect(response.body).to.haveOwnProperty('error');
                        done();
                    })
                    .catch((err) => done(err));
            })
    });

    suite("Update existing group", () => {
        test("Should be able to update an existing group", done => {

            const testGroup = {
                "_id": "599312af1b31d008b6bd2786",
                "name": "Updated via API",
                "users": [],
                "skills": [],
                "todoCardRelations": [],
                "answerCardRelations": []
            };
            const url = `/api/${orgId}/groups/${testGroup._id}`;

            request(app)
                .patch(url)
                .send(testGroup)
                .set(basicAuthHeader)
                .expect(200)
                .then(response => {
                    should().exist(response.body);
                    expect(response.body).to.haveOwnProperty('success');
                    expect(response.body.success).to.be.equal("Group has been updated");
                    done();
                })
                .catch((err) => done(err));
        });

        test("Should not be able to update a group if the group does not exist", done => {

            const testGroup = {
                "_id": "599312af1b31d008b6bd2756",
                "name": "Updated via API",
                "users": [],
                "skills": [],
                "todoCardRelations": [],
                "answerCardRelations": []
            };
            const url = `/api/${orgId}/groups/${testGroup._id}`;

            request(app)
                .patch(url)
                .send(testGroup)
                .set(basicAuthHeader)
                .expect(400)
                .then(response => {
                    should().exist(response.body);
                    expect(response.body).to.haveOwnProperty('error');
                    done();
                })
                .catch((err) => done(err));
        });
    })
});