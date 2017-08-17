import { getDatabaseManager } from "../../factory/database.factory";
import { getTestGroup } from "../../util/testobject.factory";
import { GroupCollection } from "../../data/database/schema/group.schema";
import { fixtureLoader, testUser } from "../mock/fixture.loader";
import config from "../../../config/config";
import { expect, should } from 'chai';
import { validateGroup } from "../../util/model.validator";
import GroupDataController from "../../data/datacontroller/group.datacontroller";
import { fail } from "assert";

suite("Group datacontroller", () => {

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
        test("Should be able to create a new group", done => {
            const testGroup = getTestGroup();
            GroupDataController.createGroup('hipteam', testGroup)
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
            GroupDataController.getGroupById(orgID, groupID)
                .then((group) => {
                    should().exist(group);
                    validateGroup(group);
                    expect(group._id.toString()).to.be.equal(groupID);
                    done();
                })
        })
    });

    suite("Get all groups a user participates in", () => {
        test("Should get an array of group objects", done => {
            const orgID = "hipteam";
            GroupDataController.getUserGroups(orgID, testUser._id)
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

    suite("Push userId into users array in order to add a user to the group", () => {
        test("Should be able to add a user to a group", done => {
            const orgID = "hipteam";
            const groupID = "599312a81b31d008b6bd2783";
            GroupDataController.putUserIntoGroup(orgID, testUser._id, groupID)
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

        test("Should not be able to add a user to a group if the user is already part of that group", done => {
            const orgID = "hipteam";
            const groupID = "599312a31b31d008b6bd2782";
            GroupDataController.putUserIntoGroup(orgID, testUser._id, groupID)
                .then(() => {
                    fail("DataController should throw an error, catch should be called!");
                })
                .catch((err: Error) => {
                    expect(err.message).to.be.equal("User is already part of this group");
                    done();
                })
        })
    });

    suite("Remove user from group", () => {

        test("Should be able to remove a user from a group", done => {
            const orgID = "hipteam";
            const groupID = "599312971b31d008b6bd2781";
            GroupDataController.removeUserFromGroup(orgID, testUser._id, groupID)
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

        test("Should not be able to remove a user from a group if the user is not part of that group", done => {
            const orgID = "hipteam";
            const groupID = "599312aa1b31d008b6bd2784";
            GroupDataController.removeUserFromGroup(orgID, testUser._id, groupID)
                .then(() => {
                    fail("DataController should throw an error, catch should be called!");
                })
                .catch((err: Error) => {
                    expect(err.message).to.be.equal("User is not part of this group");
                    done();
                })
        })
    })
});