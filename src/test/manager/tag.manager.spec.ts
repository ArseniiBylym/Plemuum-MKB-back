import * as sinon from 'sinon';
import TagManager from "../../api/manager/tag.manager";
import { expect } from 'chai';
import { fail } from "assert";

suite("TagManager tests", () => {

    suite("addNewTag", () => {

        test("Add new non-existing tag", async () => {
            const orgId = "orgId";
            const tag = {
                title: "New tag"
            };

            const getTags = sinon.stub();
            getTags.withArgs(orgId).resolves([{ title: "title1" }, { title: "title2" }, { title: "title3" }, { title: "title4" }])
            const tagDataController = {
                getTags: getTags,
                saveTag: sinon.stub()
            }

            const tagManager = new TagManager(tagDataController);
            await tagManager.addNewTag(orgId, tag);

            sinon.assert.calledWith(tagDataController.saveTag, orgId, sinon.match({isActive: true, title: "New tag", order: 5}));
        });

        test("Add tag with an existing title", async () => {
            const orgId = "orgId";
            const tag = {
                title: "title3"
            };

            const getTags = sinon.stub();
            getTags.withArgs(orgId).resolves([{ title: "title1" }, { title: "title2" }, { title: "title3" }, { title: "title4" }])
            const tagDataController = {
                getTags: getTags,
                saveTag: sinon.stub()
            }

            const tagManager = new TagManager(tagDataController);
            try {
                await tagManager.addNewTag(orgId, tag);
                fail("Should throw a PlenuumError")
            } catch(error) {
                expect(error.message).to.be.equal("This tag already exists");
                expect(error.getStatusCode()).to.be.equal(405);
            } finally {
                sinon.assert.notCalled(tagDataController.saveTag);
            }
        });

    });

});