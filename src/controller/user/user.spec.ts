import UserController from "./user.controller";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import {instance, mock, when} from "ts-mockito";

describe("UserController handleSaveUserRequest", () => {

    let userController: UserController;
    const mockDataController = mock(UserDataController);
    const mockResult: any = {};
    const mockRequest: any = {};
    const mockNext: any = {};

    it("Happy case: should call response send", (done) => {
        const mockResponse: any = {
            send: () => done()
        };
        when(mockDataController.handleUserSave()).thenReturn(
            new Promise<any>((resolve) => resolve(mockResult))
        );
        userController = new UserController(instance(mockDataController));
        userController.handleSaveUserRequest(mockRequest, mockResponse, mockNext);
    });

    it("Sad case: should call response json", (done) => {
        const mockResponse: any = {
            json: () => done()
        };
        when(mockDataController.handleUserSave()).thenReturn(
            new Promise<any>((resolve, reject) => reject(mockResult))
        );
        userController = new UserController(instance(mockDataController));
        userController.handleSaveUserRequest(mockRequest, mockResponse, mockNext);
    })
});