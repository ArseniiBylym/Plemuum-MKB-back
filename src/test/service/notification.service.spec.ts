import { testUser } from "../mock/fixture.loader";
import * as sinon from "sinon";
import { expect } from "chai";
import NotificationManager, { TEMPLATE } from "../../manager/notification/notification.manager";

suite("Notification tests", () => {
    const mockToken = "217c98da-92b0-48ca-b97e-22ee55a6eeb7";

    suite("Happy cases", () => {

        let notificationService: NotificationManager;
        before(() => {
            const mockService: any = {
                sendNotification: sinon.stub().resolves("mock response")
            };
            notificationService = new NotificationManager(mockService);
        });

        test("Template for feedback", () => {
            const template = TEMPLATE.FEEDBACK(testUser.firstName);
            const expected = {
                data: {
                    body: `Új visszajelzésed érkezett tőle: ${testUser.firstName}`,
                    title: `Új visszajelzés`,
                    type: "FEEDBACK"
                },
                notification: {
                    body: `Új visszajelzésed érkezett tőle: ${testUser.firstName}`,
                    title: `Új visszajelzés`,
                    type: "FEEDBACK"
                }
            };
            expect(template).to.deep.equal(expected);
        });

        test("Template for request feedback", () => {
            const template = TEMPLATE.REQUEST(testUser.firstName);
            const expected = {
                data: {
                    body: `${testUser.firstName} a visszajelzésedet kéri`,
                    title: `Új visszajelzés kérés`,
                    type: "REQUEST"
                },
                notification: {
                    body: `${testUser.firstName} a visszajelzésedet kéri`,
                    title: `Új visszajelzés kérés`,
                    type: "REQUEST"
                }
            };
            expect(template).to.deep.equal(expected);
        });

        test("Template for compass", () => {
            const template = TEMPLATE.COMPASS(testUser.firstName);
            const expected = {
                data: {
                    body: `Szeretnél segíteni ${testUser.firstName} fejlődésében?`,
                    title: `Új teendő`,
                    type: "COMPASS"
                },
                notification: {
                    body: `Szeretnél segíteni ${testUser.firstName} fejlődésében?`,
                    title: `Új teendő`,
                    type: "COMPASS"
                },
            };
            expect(template).to.deep.equal(expected);
        });

        test("Template for survey", () => {
            const template = TEMPLATE.SURVEY();
            const expected = {
                data: {
                    body: 'Új kérdőved érkezett',
                    title: `Új kérdőív`,
                    type: "SURVEY"
                },
                notification: {
                    body: 'Új kérdőved érkezett',
                    title: `Új kérdőív`,
                    type: "SURVEY"
                }
            };
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

        test("Send survey  notification", async () => {
            const template = TEMPLATE.SURVEY();
            await notificationService.sendNotification(mockToken, template)
                .then((result) => expect(result).to.not.be.undefined);
        });
    });

    suite("Sad cases", () => {

        let notificationService: NotificationManager;
        let mockError: Error;
        before(() => {
            mockError = new Error("mock error");
            const mockService: any = {
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