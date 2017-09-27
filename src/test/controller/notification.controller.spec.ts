import * as TestObjectFactory from "../../util/testobject.factory"
import { expect } from 'chai';
import * as sinon from 'sinon';
import { User } from "../../data/models/common/user.model";
import { testUser } from "../mock/fixture.loader"
import { getRequestObject } from "../util/testutil";
import NotificationController from "../../api/controller/notification.controller";

suite("NotificationController", () => {
    const mockUser: User = TestObjectFactory.getJohnDoe();

    suite("setNotificationDevice", () => {

        suite("Happy cases", () => {

            test("Should call response send", async () => {

                const notificationManager: any = {
                    setNotificationDevice: sinon.stub().resolves(mockUser)
                };

                const mockRequest: any = getRequestObject(true);
                mockRequest.user = testUser;
                mockRequest.body = {token: "mocked_token"};

                const mockResponse: any = {
                    send: sinon.stub(),
                    status: sinon.stub().callsFake(() => mockResponse)
                };
                const notificationController = new NotificationController(notificationManager);
                await notificationController.setNotificationDevice(mockRequest, mockResponse);

                expect(notificationManager.setNotificationDevice.called).to.be.true;
                sinon.assert.calledWith(mockResponse.send, mockUser);
            });
        });

        suite("Sad cases", () => {
            test("Should send status code 400", async () => {
                const notificationManager: any = {
                    setNotificationDevice: sinon.stub().rejects(new Error("mock error"))
                };

                const mockRequest: any = getRequestObject(true);
                mockRequest.user = testUser;
                mockRequest.body = {token: "mocked_token"};

                const mockResponse: any = {
                    send: sinon.stub(),
                    status: sinon.stub().callsFake(() => mockResponse)
                };
                const notificationController = new NotificationController(notificationManager);
                await notificationController.setNotificationDevice(mockRequest, mockResponse);

                sinon.assert.calledWith(mockResponse.status, 500);
                sinon.assert.calledWith(mockResponse.send, {error: "mock error"})
            })
        });

    });

    suite("refreshNotificationDevice", () => {

        let notificationManager: any;

        beforeEach(() => {
            notificationManager = {
                refreshNotificationDevice: sinon.stub()
            }
        });

        suite("Happy cases", () => {

            test("Should call method", async () => {
                const res: any = {
                    status: sinon.stub().callsFake(() => res),
                    send: sinon.stub()
                };

                const mockRequest: any = getRequestObject(true);
                mockRequest.user = testUser;
                mockRequest.body = {
                    oldToken: "old_mocked_token",
                    newToken: "new_mocked_token"
                };

                notificationManager.refreshNotificationDevice.resolves(testUser);
                const notificationController = new NotificationController(notificationManager);
                await notificationController.refreshNotificationDevice(mockRequest, res);

                expect(notificationManager.refreshNotificationDevice.called).to.be.true;
            });
        });

        suite("Sad case", () => {
            test("Should send status code 400", async () => {

                const res: any = {
                    status: sinon.stub().callsFake(() => res),
                    send: sinon.stub()
                };

                const mockRequest: any = getRequestObject(true);
                mockRequest.user = testUser;
                mockRequest.body = {
                    oldToken: "old_mocked_token",
                    newToken: "new_mocked_token"
                };

                notificationManager.refreshNotificationDevice.rejects(new Error("mock error"));
                const notificationController = new NotificationController(notificationManager);
                await notificationController.refreshNotificationDevice(mockRequest, res);

                sinon.assert.calledWith(res.status, 500);
                sinon.assert.calledWith(res.send, {error: "mock error"})
            });
        });
    });

    suite("removeNotificationToken", () => {

        let notificationManager: any;

        beforeEach(() => {
            notificationManager = {
                removeNotificationToken: sinon.stub()
            }
        });

        suite("Happy Cases", () => {
            test("Should call the method", async () => {
                const res: any = {
                    status: sinon.stub().callsFake(() => res),
                    send: sinon.stub()
                };

                const mockRequest: any = getRequestObject(true);
                mockRequest.user = testUser;
                mockRequest.body = {token: "old_mocked_token"};

                notificationManager.removeNotificationToken.resolves(testUser);
                const notificationController = new NotificationController(notificationManager);
                await notificationController.removeNotificationToken(mockRequest, res);

                expect(notificationManager.removeNotificationToken.called).to.be.true;
            });
        });

        suite("Sad Cases", () => {
            test("Should send status code 400", async () => {

                const res: any = {
                    status: sinon.stub().callsFake(() => res),
                    send: sinon.stub()
                };

                const mockRequest: any = getRequestObject(true);
                mockRequest.user = testUser;
                mockRequest.body = {token: "old_mocked_token"};

                notificationManager.removeNotificationToken.rejects(new Error("mock error"));
                const notificationController = new NotificationController(notificationManager);
                await notificationController.removeNotificationToken(mockRequest, res);

                sinon.assert.calledWith(res.status, 500);
                sinon.assert.calledWith(res.send, {error: "mock error"})
            });
        });
    });
});
