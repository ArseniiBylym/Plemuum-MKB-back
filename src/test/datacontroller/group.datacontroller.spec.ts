import { getDatabaseManager } from "../../factory/database.factory";
import { getTestGroup } from "../../util/testobject.factory";
import { GroupCollection } from "../../data/database/schema/organization/group.schema";
import { fixtureLoader, testUser } from "../mock/fixture.loader";
import config from "../../../config/config";
import { expect, should } from 'chai';
import { validateGroup } from "../../util/model.validator";
import { fail } from "assert";
import { getGroupDataController, GroupDataController } from "../../data/datacontroller/group.datacontroller";

suite("Group datacontroller", () => {

    let groupDataController: GroupDataController;

    before((done) => {
        groupDataController = getGroupDataController();
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
        test("Should be able to create a new group", done => {
            const testGroup = getTestGroup();
            groupDataController.createGroup('hipteam', testGroup)
                .then(() => GroupCollection('hipteam').findOne({name: testGroup.name}).lean().exec())
                .then((group) => {
                    should().exist(group);
                    validateGroup(group);
                    done();
                })
        })
    });

    suite("Get group by ID", () => {
        test("Should be able to get a group by its ID", done => {
            const groupID = "599312971b31d008b6bd2781";
            const orgID = "hipteam";
            groupDataController.getGroupById(orgID, groupID)
                .then((group) => {
                    should().exist(group);
                    validateGroup(group);
                    expect(group._id.toString()).to.be.equal(groupID);
                    done();
                })
        })
    });

    suite("Get all groups a common participates in", () => {
        test("Should get an array of group objects", done => {
            const orgID = "hipteam";
            groupDataController.getUserGroups(orgID, testUser._id)
                .then((groups) => {
                    should().exist(groups);
                    expect(groups).length(3);
                    groups.forEach((group: any) => {
                        validateGroup(group);
                    });
                    done();
                })
        })
    });

    suite("Push userId into users array in order to add a common to the group", () => {
        test("Should be able to add a common to a group", done => {
            const orgID = "hipteam";
            const groupID = "599312a81b31d008b6bd2783";
            groupDataController.putUserIntoGroup(orgID, testUser._id, groupID)
                .then(() => GroupCollection('hipteam').findById(groupID).lean().exec())
                .then((group: any) => {
                    should().exist(group);
                    expect(group.users).contains(testUser._id);
                    done();
                })
                .catch((err: any) => {
                    done(err);
                })
        });

        test("Should not be able to add a common to a group if the common is already part of that group", done => {
            const orgID = "hipteam";
            const groupID = "599312a31b31d008b6bd2782";
            groupDataController.putUserIntoGroup(orgID, testUser._id, groupID)
                .then(() => {
                    fail("DataController should throw an error, catch should be called!");
                })
                .catch((err: Error) => {
                    expect(err.message).to.be.equal("User is already part of this group");
                    done();
                })
        })
    });

    suite("Remove common from group", () => {

        test("Should be able to remove a common from a group", done => {
            const orgID = "hipteam";
            const groupID = "599312971b31d008b6bd2781";
            groupDataController.removeUserFromGroup(orgID, testUser._id, groupID)
                .then(() => GroupCollection('hipteam').findById(groupID).lean().exec())
                .then((group: any) => {
                    should().exist(group);
                    expect(group.users).not.contains(testUser._id);
                    expect(group.users).lengthOf(1);
                    done();
                })
                .catch((err: any) => {
                    done(err);
                })
        });

        test("Should not be able to remove a common from a group if the common is not part of that group", done => {
            const orgID = "hipteam";
            const groupID = "599312aa1b31d008b6bd2784";
            groupDataController.removeUserFromGroup(orgID, testUser._id, groupID)
                .then(() => {
                    fail("DataController should throw an error, catch should be called!");
                })
                .catch((err: Error) => {
                    expect(err.message).to.be.equal("User is not part of this group");
                    done();
                })
        })
    });

    suite("Update existing group", () => {
        test("Should be able to update and existing group", done => {
            const testGroup = {
                "_id": "599312af1b31d008b6bd2786",
                "updatedAt": "2017-08-15T15:26:39.272Z",
                "createdAt": "2017-08-15T15:26:39.272Z",
                "name": "Test Group F",
                "users": [
                    "5984342227cd340363dc84af",
                    "5984342227cd340363dc84c7"
                ],
                "skills": [],
                "todoCardRelations": [],
                "answerCardRelations": []
            };
            testGroup.name = testGroup.name + " UPDATED";
            groupDataController.updateGroup('hipteam', testGroup._id, testGroup)
                .then((res) => {
                    console.log(res);
                    done();
                })
                .catch((err) => done(err))
        });

        test("Should get an error if the group does not exist", done => {
            const testGroup = {
                "_id": "599312af1b31d008b6bd278c",  // This one does not exist
                "updatedAt": "2017-08-15T15:26:39.272Z",
                "createdAt": "2017-08-15T15:26:39.272Z",
                "name": "Test Group F",
                "users": [
                    "5984342227cd340363dc84af",
                    "5984342227cd340363dc84c7"
                ],
                "skills": [],
                "todoCardRelations": [],
                "answerCardRelations": []
            };
            testGroup.name = testGroup.name + " UPDATED";
            groupDataController.updateGroup('hipteam', testGroup._id, testGroup)
                .then((res) => {
                    fail("Should catch and error!");
                    done();
                })
                .catch((err) => {
                    expect(err.message).to.be.equal('Group was not found');
                    done();
                })
        })
    })
});