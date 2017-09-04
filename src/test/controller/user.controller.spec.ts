import UserController from "../../api/controller/user.controller";
import * as TestObjectFactory from "../../util/testobject.factory"
import { assert, expect, should } from 'chai';
import * as sinon from 'sinon';
import * as Sinon from 'sinon';
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { User } from "../../data/models/common/user.model";
import { testUser } from "../mock/fixture.loader"
import { getRequestObject } from "../util/testutil";
import { ErrorType, PlenuumError } from "../../util/errorhandler";

suite("UserController", () => {

    const mockUser: User = TestObjectFactory.getJohnDoe();
    const dummy: any = {};

    before(() => {

    });

    suite("createNewUser", () => {

        test("Happy case: should call response send", async () => {
            const mockRequest: any = getRequestObject(true);
            mockRequest.body = mockUser;

            const mockResponse: any = {
                send: sinon.stub(),
                status: sinon.stub().callsFake(() => mockResponse)
            };

            const userDataControllerStub = sinon.stub(UserDataController, 'saveUser').resolves(mockUser);

            const userController = new UserController(dummy);
            await userController.createNewUser(mockRequest, mockResponse);
            userDataControllerStub.restore();

            sinon.assert.calledWith(mockResponse.status, 201);
            sinon.assert.calledWith(mockResponse.send, mockUser)
        });

        test("Sad case: should return an error", async () => {
            const mockRequest: any = getRequestObject(true);
            mockRequest.body = mockUser;

            const mockResponse: any = {
                send: sinon.stub(),
                status: sinon.stub().callsFake(() => mockResponse)
            };

            const userDataControllerStub = sinon.stub(UserDataController, 'saveUser')
                .rejects(new PlenuumError("Mock error", ErrorType.NOT_IMPLEMENTED));

            const userController = new UserController(dummy);
            await userController.createNewUser(mockRequest, mockResponse);
            userDataControllerStub.restore();

            sinon.assert.calledWith(mockResponse.status, 501);
            sinon.assert.calledWith(mockResponse.send, { error: "Mock error" })
        })
    });

    suite("showRegistrationForm", () => {

        let renderWasCalled = false;
        let renderPage: string;

        const mockResponse: any = {
            render: (page: string) => {
                renderWasCalled = true;
                renderPage = page;
            }
        };

        test("Should call res.render with newUser", done => {
            UserController.showRegistrationForm(dummy, mockResponse);
            assert(renderWasCalled);
            assert(renderPage === "newUser", "Render page does not match: " + renderPage);
            done();
        })
    });

    suite("setNotificationDevice", () => {

        suite("Happy cases", () => {

            test("Should call response send", async () => {
                const setUserNotificationDeviceStub = sinon.stub(UserDataController, "setUserNotificationDevice")
                    .returns(new Promise((resolve, reject) => resolve(mockUser)));

                const mockRequest: any = getRequestObject(true);
                mockRequest.user = testUser;
                mockRequest.body = { token: "mocked_token" }

                const mockResponse: any = {
                    send: sinon.stub(),
                    status: sinon.stub().callsFake(() => mockResponse)
                };
                const userController = new UserController(dummy);
                await userController.setNotificationDevice(mockRequest, mockResponse);
                setUserNotificationDeviceStub.restore();

                expect(setUserNotificationDeviceStub.called).to.be.true;
                sinon.assert.calledWith(mockResponse.send, mockUser);
            });
        });

        suite("Sad cases", () => {
            test("Should send status code 400", async () => {
                const setUserNotificationDeviceStub = sinon.stub(UserDataController, "setUserNotificationDevice")
                    .rejects(new Error("mock error"));

                const mockRequest: any = getRequestObject(true);
                mockRequest.user = testUser;
                mockRequest.body = { token: "mocked_token" }

                const mockResponse: any = {
                    send: sinon.stub(),
                    status: sinon.stub().callsFake(() => mockResponse)
                };
                const userController = new UserController(dummy);
                await userController.setNotificationDevice(mockRequest, mockResponse);
                setUserNotificationDeviceStub.restore();

                sinon.assert.calledWith(mockResponse.status, 500);
                sinon.assert.calledWith(mockResponse.send, { error: "mock error" })
            })
        });


    });

    suite("refreshNotificationDevice", () => {

        let refreshNotificationDeviceStub: any;

        beforeEach(() => {
            refreshNotificationDeviceStub = sinon.stub(UserDataController, "refreshNotificationDevice")
        });

        afterEach(() => {
            refreshNotificationDeviceStub.restore();
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

                refreshNotificationDeviceStub.resolves(testUser);
                const userController = new UserController(dummy);
                await userController.refreshNotificationDevice(mockRequest, res);

                expect(refreshNotificationDeviceStub.called).to.be.true;
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

                refreshNotificationDeviceStub.rejects(new Error("mock error"));
                const userController = new UserController(dummy);
                await userController.refreshNotificationDevice(mockRequest, res);

                sinon.assert.calledWith(res.status, 500)
                sinon.assert.calledWith(res.send, { error: "mock error" })
            });
        });
    });

    suite("removeNotificationToken", () => {

        let removeNotificationTokenStub: any;

        beforeEach(() => {
            removeNotificationTokenStub = sinon.stub(UserDataController, "removeNotificationToken")
        });

        afterEach(() => {
            removeNotificationTokenStub.restore();
        });

        suite("Happy Cases", () => {
            test("Should call the method", async () => {
                const res: any = {
                    status: sinon.stub().callsFake(() => res),
                    send: sinon.stub()
                };

                const mockRequest: any = getRequestObject(true);
                mockRequest.user = testUser;
                mockRequest.body = { token: "old_mocked_token" };

                removeNotificationTokenStub.resolves(testUser);
                const userController = new UserController(dummy);
                await userController.removeNotificationToken(mockRequest, res);

                expect(removeNotificationTokenStub.called).to.be.true;
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
                mockRequest.body = { token: "old_mocked_token" };

                removeNotificationTokenStub.rejects(new Error("mock error"));
                const userController = new UserController(dummy);
                await userController.removeNotificationToken(mockRequest, res);

                sinon.assert.calledWith(res.status, 500)
                sinon.assert.calledWith(res.send, { error: "mock error" })
            });
        });
    });
});