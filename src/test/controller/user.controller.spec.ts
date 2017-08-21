import UserController from "../../api/controller/user.controller";
import * as TestObjectFactory from "../../util/testobject.factory"
import { assert, expect, should } from 'chai';
import * as sinon from 'sinon';
import * as Sinon from 'sinon';
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { User } from "../../data/models/common/user.model";

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
    })
});