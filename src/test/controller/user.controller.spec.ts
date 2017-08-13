import UserController from "../../controller/user.controller";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import * as TestObjectFactory from "../../util/testobject.factory"
import { anything, instance, mock, verify, when } from "ts-mockito";
import { User } from "../../data/models/user.model";
import { expect, should, assert } from 'chai';

suite("UserController", () => {

    suite("createNewUser", () => {

        let userController: UserController;
        const mockDataController = mock(UserDataController);
        const mockResetPassDataController: any = {};
        const mockResult: any = {};
        const mockRequest: any = {};

        test("Happy case: should call response send", (done) => {
            const mockUser: User = TestObjectFactory.getJohnDoe();
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
            when(mockDataController.saveUser(anything())).thenReturn(
                new Promise<any>((resolve) => resolve(mockUser))
            );
            userController = new UserController(instance(mockDataController), mockResetPassDataController, mockRequest, mockRequest);
            userController.createNewUser(mockRequest, mockResponse);
            verify(mockDataController.saveUser(anything())).called();
        });

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
        })
    });

    suite("showRegistrationForm", () => {

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