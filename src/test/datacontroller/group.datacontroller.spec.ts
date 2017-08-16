import { getDatabaseManager } from "../../factory/database.factory";
import { getTestGroup } from "../../util/testobject.factory";
import { GroupCollection } from "../../data/database/schema/group.schema";
import { fixtureLoader, testUser } from "../mock/fixture.loader";
import config from "../../../config/config";
import { expect, should } from 'chai';
import { validateGroup } from "../../util/model.validator";
import { groupDataController } from "../../data/datacontroller/group.datacontroller";

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

    suite("Get all groups a user participates in", () => {
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
    })
});