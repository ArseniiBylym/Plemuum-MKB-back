import UserController from "./user.controller";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import * as TestObjectFactory from "../../util/testobject.factory"
import { anything, instance, mock, when } from "ts-mockito";
import { User } from "../../data/models/user.model";
import { expect, should } from 'chai';

describe("UserController handleSaveUserRequest", () => {

    let userController: UserController;
    const mockDataController = mock(UserDataController);
    const mockResult: any = {};
    const mockRequest: any = {};

    it("Happy case: should call response send", (done) => {
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
        userController = new UserController(instance(mockDataController));
        userController.createNewUser(mockRequest, mockResponse);
    });

    it("Sad case: should call response json", (done) => {
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
        userController = new UserController(instance(mockDataController));
        userController.createNewUser(mockRequest, mockResponse);
    })
});