import * as sinon from 'sinon';
import { assert, expect } from 'chai';
import { getTestGroup } from "../../util/testobject.factory";
import * as modelValidator from "../../util/model.validator";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { testUser } from "../mock/fixture.loader";
import GroupManager from "../../api/interactor/group.interactor";

suite("Group manager", () => {

    suite("Get answer card users", () => {

        test("Should return a list of user objects", async () => {
            const orgId = "hipteam";
            const userId = "123412341234";
            const groupDataController: any = {
                getUserGroups: sinon.stub().resolves([getTestGroup()]),
                getGroupById: sinon.stub().resolves(getTestGroup())
            };

            const getUserById = sinon.stub(UserDataController, "getUserByIdFromOrg").resolves(testUser);

            const groupManager = new GroupManager(groupDataController);
            const result = await groupManager.getAnswerCardUsers(orgId, userId);

            getUserById.restore();

            assert.isArray(result);
            expect(result.length).to.be.greaterThan(0);
            modelValidator.validateUser(result[0]);

            result.forEach((element: any) => {
                const filtered = result.filter((user: any) => user._id === element._id);
                expect(filtered.length).to.be.equal(1);
            });
        })
    });
});