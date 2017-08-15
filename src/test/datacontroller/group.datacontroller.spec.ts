import GroupDataController from "../../data/datacontroller/group.datacontroller";
import { getDatabaseManager } from "../../factory/database.factory";
import { getTestGroup } from "../../util/testobject.factory";
import { GroupCollection } from "../../data/database/schema/group.schema";
import { fixtureLoader } from "../mock/fixture.loader";
import config from "../../../config/config";
import { should } from 'chai';
import { validateGroup } from "../../util/model.validator";

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

    const databaseManager = getDatabaseManager();
    const groupDataController = new GroupDataController(databaseManager);

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
    })
});