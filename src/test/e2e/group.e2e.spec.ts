import { getDatabaseManager } from "../../factory/database.factory";
import config from "../../../config/config";
import { adminAuthenticate, authenticate, fixtureLoader, testUser } from "../mock/fixture.loader";
import * as request from 'supertest';
import app from "../../app";
import { bearerAuthHeader } from "../util/header.helper";
import { validateGroup } from "../../util/model.validator";
import { getTestGroup } from "../../util/testobject.factory";
import { expect, should } from 'chai';

suite("Group request test", () => {

    const orgId = "hipteam";

    before(async () => {
        await getDatabaseManager().openConnection(config.mongoUrl);
        await fixtureLoader();
    });

    after(async () => await getDatabaseManager().closeConnection());

    suite("Create group", () => {
        test("Should be able to create a group, response should contain a group object, return 201", async () => {
            const url = `/api/organizations/${orgId}/groups`;
            const token = await adminAuthenticate();
            const response = await request(app)
                .post(url)
                .send(getTestGroup())
                .set(bearerAuthHeader(token))
                .expect(201);
            validateGroup(response.body);
        });
    });

    suite("Get group by ID", () => {
        test("Should be able to get a group by its id", async () => {
            const groupID = "599312971b31d008b6bd2781";
            const url = `/api/organizations/${orgId}/groups/${groupID}`;
            const token = await authenticate(testUser);
            const response = await request(app)
                .get(url)
                .send(getTestGroup())
                .set(bearerAuthHeader(token))
                .expect(200);

            should().exist(response.body);
            validateGroup(response.body);
            expect(response.body._id.toString()).to.be.equal(groupID);
        })
    });

    suite("Get groups for user", () => {
        test("Should be able to get all groups a user participates in", async () => {

            const url = `/api/organizations/${orgId}/users/me/groups`;

            const token = await authenticate(testUser);
            const response = await request(app)
                .get(url)
                .send(getTestGroup())
                .set(bearerAuthHeader(token))
                .expect(200);
            should().exist(response.body);
            expect(response.body).to.be.an.instanceof(Array);
            response.body.forEach((group: any) => validateGroup(group));
        })
    });

    suite("Put user into group", () => {
        test("Should be able to put a user in a group", async () => {
            const userID = "5984342227cd340363dc84af";
            const groupID = "599312a81b31d008b6bd2783";
            const url = `/api/organizations/${orgId}/groups/${groupID}/users`;

            const token = await adminAuthenticate();
            const response = await request(app)
                .post(url)
                .send({userId: userID})
                .set(bearerAuthHeader(token))
                .expect(200);
            should().exist(response.body);
            expect(response.body).to.haveOwnProperty('success');
            expect(response.body.success).to.be.equal("User has been added");
        });

        test("Should not be able to put a user in a group if the user is already part of that group", async () => {
            const userID = "5984342227cd340363dc84b2";
            const groupID = "599312a31b31d008b6bd2782";
            const url = `/api/organizations/${orgId}/groups/${groupID}/users`;

            const token = await adminAuthenticate();
            const response = await request(app)
                .post(url)
                .send({userId: userID})
                .set(bearerAuthHeader(token))
                .expect(405);

            should().exist(response.body);
            expect(response.body).to.haveOwnProperty('error');
        })
    });

    suite("Remove user from group", () => {
        test("Should be able to remove a user from a group", async () => {

            const userID = "5984342227cd340363dc84c6";
            const groupID = "599312971b31d008b6bd2781";
            const url = `/api/organizations/${orgId}/groups/${groupID}/users`;

            const token = await adminAuthenticate();
            const response = await request(app)
                .delete(url)
                .send({userId: userID})
                .set(bearerAuthHeader(token))
                .expect(200);

            should().exist(response.body);
            expect(response.body).to.haveOwnProperty('success');
            expect(response.body.success).to.be.equal("User has been removed");
        });

        test("Should not be able to remove a user from a group if the user is not part of that group", async () => {
            const userID = "5984342227cd340363dc84af";
            const groupID = "599312aa1b31d008b6bd2784";
            const url = `/api/organizations/${orgId}/groups/${groupID}/users`;

            const token = await adminAuthenticate();
            const response = await request(app)
                .delete(url)
                .send({userId: userID})
                .set(bearerAuthHeader(token))
                .expect(405);
            should().exist(response.body);
            expect(response.body).to.haveOwnProperty('error');
        })
    });

    suite("Update existing group", () => {
        test("Should be able to update an existing group", async () => {
            const testGroup = {
                "_id": "599312af1b31d008b6bd2786",
                "name": "Updated via API",
                "users": [],
                "skills": [],
                "todoCardRelations": [],
                "answerCardRelations": []
            };
            const url = `/api/organizations/${orgId}/groups`;

            const token = await adminAuthenticate();
            const response = await request(app)
                .patch(url)
                .send(testGroup)
                .set(bearerAuthHeader(token))
                .expect(200);

            should().exist(response.body);
            expect(response.body).to.haveOwnProperty('success');
            expect(response.body.success).to.be.equal("Group has been updated");
        });

        test("Should not be able to update a group if the group does not exist", async () => {
            const testGroup = {
                "_id": "599312af1b31d008b6bd2756",
                "name": "Updated via API",
                "users": [],
                "skills": [],
                "todoCardRelations": [],
                "answerCardRelations": []
            };
            const url = `/api/organizations/${orgId}/groups`;

            const token = await adminAuthenticate();
            const response = await request(app)
                .patch(url)
                .send(testGroup)
                .set(bearerAuthHeader(token))
                .expect(404);
            should().exist(response.body);
            expect(response.body).to.haveOwnProperty('error');
        });
    });

    suite("Get answer card users", () => {
        test("Should return a list of users without doubling and the current user", async () => {
            const url = `/api/organizations/${orgId}/users/me/groups/answer-card-users`;

            const self = {
                "_id": testUser._id,
                "firstName": testUser.firstName,
                "lastName": testUser.lastName,
                "email": testUser.email,
                "pictureUrl": testUser.pictureUrl
            };

            const token = await authenticate(testUser);
            const response = await request(app)
                .get(url)
                .set(bearerAuthHeader(token))
                .expect(200);

            should().exist(response.body);
            expect(response.body).to.be.instanceOf(Array);
            expect(response.body).length(4);
            expect(response.body).not.contain(self);
        })
    });
});