import UserController from "../../api/controller/user.controller";
import * as TestObjectFactory from "../../util/testobject.factory"
import { assert, expect, should } from 'chai';
import * as sinon from 'sinon';
import * as Sinon from 'sinon';
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { User } from "../../data/models/common/user.model";
import { testUser} from "../mock/fixture.loader"

suite("UserController", () => {

    let userController: UserController;
    let userDataControllerStub: Sinon.SinonSpy;
    const mockUser: User = TestObjectFactory.getJohnDoe();
    const dummy: any = {};

    before(done => {
        userDataControllerStub = sinon.stub(UserDataController, 'saveUser')
            .returns(new Promise((resolve, reject) => resolve(mockUser)));
        done();
    });

    suite("createNewUser", () => {

        test("Happy case: should call response send", (done) => {

            const mockRequest: any = {
                body: mockUser
            };
            const mockResponse: any = {
                send: (result: any) => {
                    should().equal(result, mockUser);
                    done();
                },
                status: (statusCode: number) => mockResponse
            };
            userController = new UserController(dummy, dummy);
            userController.createNewUser(mockRequest, mockResponse);
            userDataControllerStub.restore();
            expect(userDataControllerStub.called).to.be.true;
        });

        test("Sad case: should call response json", (done) => {
            const mockRequest: any = {
                body: mockUser
            };
            const mockResponse: any = {
                json: (error: any) => {
                    expect(error).have.property("error");
                    done()
                },
                status: (statusCode: number) => {
                    expect(statusCode).to.be.equal(400);
                    return mockResponse;
                }
            };
            userController = new UserController(dummy, dummy);
            userController.createNewUser(dummy, mockResponse);
            expect(userDataControllerStub.called).to.be.true;
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

            test("Should call response send", (done) => {
                const setUserNotificationDeviceStub = sinon.stub(UserDataController, "setUserNotificationDevice")
                    .returns(new Promise((resolve, reject) => resolve(mockUser)));
                const mockRequest: any = {
                    user: testUser,
                    body: { token: "mocked_token" }
                };

                const mockResponse: any = {
                    send: (result: any) => {
                        should().equal(result, mockUser);
                        done();
                    },
                    status: (statusCode: number) => mockResponse
                };
                userController = new UserController(dummy, dummy);
                userController.setNotificationDevice(mockRequest, mockResponse);
                setUserNotificationDeviceStub.restore();
                expect(setUserNotificationDeviceStub.called).to.be.true;
            });
        });

        suite("Sad cases", () => {
            test("Should send status code 400", (done) => {
                const setUserNotificationDeviceStub = sinon.stub(UserDataController, "setUserNotificationDevice")
                    .returns(new Promise((resolve, reject) => reject(new Error("mock error"))));

                const mockRequest: any = {
                    user: testUser,
                    body: { token: "mocked_token" }
                };

                const mockResponse: any = {
                    send: (result: any) => result,
                    status: (statusCode: number) => {
                        expect(statusCode).to.be.equal(400);
                        done();
                    }
                };
                userController = new UserController(dummy, dummy);
                userController.setNotificationDevice(mockRequest, mockResponse);
                setUserNotificationDeviceStub.restore();

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

            test("Should call method", () => {
                const res: any = {
                    status: sinon.stub().callsFake(() => res),
                    send: sinon.stub()};

                const mockRequest: any = {
                    user: testUser,
                    body: {
                        oldToken: "old_mocked_token",
                        newToken: "new_mocked_token"
                    }
                };

                refreshNotificationDeviceStub.resolves(testUser);
                userController = new UserController(dummy, dummy);
                userController.refreshNotificationDevice(mockRequest, res);

                expect(refreshNotificationDeviceStub.called).to.be.true;
            });
        });

        suite("Sad case", () => {
           test("Should send status code 400", () => {

               const res: any = {
                   status: sinon.stub().callsFake((statusCode) => {
                       expect(statusCode).to.be.equal(400);
                   }),
                   send: sinon.stub()};

               const mockRequest: any = {
                   user: testUser,
                   body: {
                       oldToken: "old_mocked_token",
                       newToken: "new_mocked_token"
                   }
               };

               refreshNotificationDeviceStub.rejects(new Error("mock error"));
               userController = new UserController(dummy, dummy);
               userController.refreshNotificationDevice(mockRequest, res);

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
            test("Should call the method", () => {
                const res: any = {
                    status: sinon.stub().callsFake(() => res),
                    send: sinon.stub()};

                const mockRequest: any = {
                    user: testUser,
                    body: { token: "old_mocked_token" }
                };

                removeNotificationTokenStub.resolves(testUser);
                userController = new UserController(dummy, dummy);
                userController.removeNotificationToken(mockRequest, res);

                expect(removeNotificationTokenStub.called).to.be.true;
            });
        });

        suite("Sad Cases", () => {
            test("Should send status code 400", () => {

                const res: any = {
                    status: sinon.stub().callsFake((statusCode) => {
                        expect(statusCode).to.be.equal(400);
                    }),
                    send: sinon.stub()};

                const mockRequest: any = {
                    user: testUser,
                    body: { token: "old_mocked_token" }
                };

                removeNotificationTokenStub.rejects(new Error("mock error"));
                userController = new UserController(dummy, dummy);
                userController.removeNotificationToken(mockRequest, res);

            });
        });
    });
});