import { testUser } from "../mock/fixture.loader";
import * as sinon from "sinon";
import { expect } from "chai";
import NotificationService from "../../service/notification/notification.service";

suite("Notification tests", () => {
    const mockToken = "217c98da-92b0-48ca-b97e-22ee55a6eeb7";

    suite("Happy cases", () => {

        let notificationService : NotificationService;
        before(() => {
            const mockService :any = {
                sendNotification: sinon.stub().resolves("mock response")
            };
            notificationService = new NotificationService(mockService);
        });

        test("Get Notification From template Feedback", () => {
            const expectedResult = {
                body: `You received a feedback from ${testUser.firstName}`,
                title: `New feedback`
            };
            const result = NotificationService.getNotificationFromTemplate(testUser.firstName, "FEEDBACK");
            expect(result).to.deep.equal(expectedResult);
        });

        test("Get Notification From template Request", () => {
            const expectedResult = {
                body: `${testUser.firstName} needs your feedback`,
                title: `New feedback request`
            };
            const result = NotificationService.getNotificationFromTemplate(testUser.firstName, "REQUEST");
            expect(result).to.deep.equal(expectedResult);
        });

        test("Get Notification From template Compass", () => {
            const expectedResult = {
                body: `Would you like to help ${testUser.firstName} to improve?`,
                title: `New todo`
            };
            const result = NotificationService.getNotificationFromTemplate(testUser.firstName, "COMPASS");
            expect(result).to.deep.equal(expectedResult);
        });

        test("Get Notification From template undefined", () => {
            const expectedResult = { body: "",  title: ""};
            const result = NotificationService.getNotificationFromTemplate(testUser.firstName, "");
            expect(result).to.deep.equal(expectedResult);
        });

        test("Send feedback notification", async () => {
            const mockType = "FEEDBACK";
            await notificationService.sendNotification(mockToken, testUser.firstName, mockType)
                .then((result) => expect(result).to.not.be.undefined);
        });

        test("Send request feedback notification", async () => {
            const mockType = "REQUEST";
            await notificationService.sendNotification(mockToken, testUser.firstName, mockType)
                .then((result) => expect(result).to.not.be.undefined);
        });

        test("Send compass  notification", async () => {
            const mockType = "COMPASS";
            await notificationService.sendNotification(mockToken, testUser.firstName, mockType)
                .then((result) => expect(result).to.not.be.undefined);
        });
    });

    suite("Sad cases", () => {

        let notificationService : NotificationService;
        let mockError : Error;
        before(() => {
            mockError = new Error("mock error");
            const mockService :any = {
                sendNotification: sinon.stub().rejects(mockError)
            };
            notificationService = new NotificationService(mockService);
        });

        test("Send compass  notification", async () => {
            const mockType = "COMPASS";
            await notificationService.sendNotification(mockToken, testUser.firstName, mockType)
                .catch((err: Error) => expect(err).to.be.equal(mockError))
        });
    });

});