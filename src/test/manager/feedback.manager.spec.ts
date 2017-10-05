import UserDataController from "../../data/datacontroller/user.datacontroller";
import * as sinon from "sinon";
import FeedbackDataController from "../../data/datacontroller/feedback.datacontroller";
import FeedbackManager from "../../api/manager/feedback.manager";
import { PRIVACY, TYPE } from "../../data/models/organization/feedback.model";
import { testUser } from "../mock/fixture.loader";
import { expect } from 'chai';
import { PlenuumError } from "../../util/errorhandler";
import { fail } from "assert";

suite("Feedback manager", () => {

    suite("postFeedback", () => {

        const orgId = "hipteam";

        test("Should call FeedbackDataController to save the feedback", async () => {

            const feedback: any = {
                recipientId: "5984342227cd340363dc84aa",
                message: "Feedback message",
                privacy: [PRIVACY.PRIVATE],
                type: TYPE.CONTINUE,
                tags: [],
            };

            const getUserById = sinon.stub(UserDataController, 'getUserByIdFromOrg');
            const saveFeedback = sinon.stub(FeedbackDataController, 'saveFeedback');

            getUserById.resolves(testUser);
            saveFeedback.resolves(feedback);

            const feedbackManager = new FeedbackManager();
            await feedbackManager.postFeedback(orgId, feedback);

            getUserById.restore();
            saveFeedback.restore();

            sinon.assert.calledWith(getUserById, orgId, "5984342227cd340363dc84aa");
            sinon.assert.calledWith(saveFeedback, orgId, feedback);
        });


        test("Should throw not found exception", async () => {
            const feedback: any = {
                recipientId: "undefined",
                message: "Feedback message",
                privacy: [PRIVACY.PRIVATE],
                type: TYPE.CONTINUE,
                tags: [],
            };

            const getUserById = sinon.stub(UserDataController, 'getUserByIdFromOrg');

            getUserById.resolves(null);

            const feedbackManager = new FeedbackManager();
            try {
                await feedbackManager.postFeedback(orgId, feedback);
                fail("Should throw an exception")
            } catch (err) {
                expect(err).to.be.instanceOf(PlenuumError);
                expect(err.getStatusCode()).to.be.equal(404);
                expect(err.message).to.be.equal("Recipient user not found");
            } finally {
                getUserById.restore();
            }
        })
    })

});