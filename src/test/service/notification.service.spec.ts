import {testUser} from "../mock/fixture.loader";
import * as sinon from "sinon";
import {expect} from "chai";
import NotificationManager, { TEMPLATE } from "../../manager/notification/notification.manager";

suite("Notification tests", () => {
    const mockToken = "217c98da-92b0-48ca-b97e-22ee55a6eeb7";

    suite("Happy cases", () => {

        let notificationService : NotificationManager;
        before(() => {
            const mockService :any = {
                sendNotification: sinon.stub().resolves("mock response")
            };
            notificationService = new NotificationManager(mockService);
        });

        test("Template for feedback", () => {
            const template = TEMPLATE.FEEDBACK(testUser.firstName);
            const expected = {
                body: `You received a feedback from ${testUser.firstName}`,  title: `New feedback`
            };
            expect(template).to.deep.equal(expected);
        });

        test("Template for request feedback", () => {
            const template = TEMPLATE.REQUEST(testUser.firstName);
            const expected = { body: `${testUser.firstName} needs your feedback`, title: `New feedback request`};
            expect(template).to.deep.equal(expected);
        });

        test("Template for compass", () => {
            const template = TEMPLATE.COMPASS(testUser.firstName);
            const expected = { body: `Would you like to help ${testUser.firstName} to improve?`, title: `New todo`};
            expect(template).to.deep.equal(expected);
        });

        test("Send feedback notification", async () => {
            const template = TEMPLATE.FEEDBACK(testUser.firstName);
            await notificationService.sendNotification(mockToken, template)
                .then((result) => expect(result).to.not.be.undefined);
        });

        test("Send request feedback notification", async () => {
            const template = TEMPLATE.REQUEST(testUser.firstName);
            await notificationService.sendNotification(mockToken, template)
                .then((result) => expect(result).to.not.be.undefined);
        });

        test("Send compass  notification", async () => {
            const template = TEMPLATE.COMPASS(testUser.firstName);
            await notificationService.sendNotification(mockToken, template)
                .then((result) => expect(result).to.not.be.undefined);
        });
    });

    suite("Sad cases", () => {

        let notificationService : NotificationManager;
        let mockError : Error;
        before(() => {
            mockError = new Error("mock error");
            const mockService :any = {
                sendNotification: sinon.stub().rejects(mockError)
            };
            notificationService = new NotificationManager(mockService);
        });

        test("Send compass  notification", async () => {
            const template = TEMPLATE.COMPASS(testUser.firstName);
            await notificationService.sendNotification(mockToken, template)
                .catch((err: Error) => expect(err).to.be.equal(mockError))
        });
    });

});