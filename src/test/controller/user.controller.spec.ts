import UserController from "../../controller/user.controller";
import * as TestObjectFactory from "../../util/testobject.factory"
import { User } from "../../data/models/user.model";
import { assert, expect, should } from 'chai';
import * as sinon from 'sinon';
import * as Sinon from 'sinon';
import { userDataController } from "../../data/datacontroller/user.datacontroller";

suite("UserController", () => {

    //TODO MAKE THIS TEST GREAT AGAIN!
    let userController: UserController;
    let userDataControllerStub: Sinon.SinonSpy;
    const mockUser: User = TestObjectFactory.getJohnDoe();
    const dummy: any = {};

    before(done => {
        userDataControllerStub = sinon.stub(userDataController, 'saveUser')
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
        /*
                test("Sad case: should call response json", (done) => {
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
                    when(mockDataController.saveUser(anything())).thenReturn(
                        new Promise<any>((resolve, reject) => reject(mockResult))
                    );
                    userController = new UserController(instance(mockDataController), mockResetPassDataController, mockRequest, mockRequest);
                    userController.createNewUser(mockRequest, mockResponse);
                    verify(mockDataController.saveUser(anything())).called();
                })*/
    });

    suite.skip("showRegistrationForm", () => {

        let renderWasCalled = false;
        let renderPage: string;

        let userController: UserController;
        const mockDataController: any = {};
        const mockResetPassDataController: any = {};
        const mockResponse: any = {
            render: (page: string) => {
                renderWasCalled = true;
                renderPage = page;
            }
        };

        test("Should call res.render with newUser", done => {
            const mockUser: User = TestObjectFactory.getJohnDoe();
            const dummy: any = {};

            UserController.showRegistrationForm(dummy, mockResponse);
            assert(renderWasCalled);
            assert(renderPage === "newUser", "Render page does not match: " + renderPage);
            done();
        })
    })
});