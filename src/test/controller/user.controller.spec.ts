import UserController from "../../api/controller/user.controller";
import * as TestObjectFactory from "../../util/testobject.factory"
import * as sinon from 'sinon';
import UserDataController from "../../data/datacontroller/user.datacontroller";
import {User} from "../../data/models/common/user.model";
import {getRequestObject} from "../util/testutil";
import {ErrorType, PlenuumError} from "../../util/errorhandler";

suite("UserController", () => {

    const mockUser: User = TestObjectFactory.getJohnDoe();

    suite("registerUser", () => {

        test("Happy case: should call response send", async () => {
            const mockRequest: any = getRequestObject(true);
            mockRequest.body = mockUser;

            const mockResponse: any = {
                send: sinon.stub(),
                status: sinon.stub().callsFake(() => mockResponse)
            };

            const mockuserManager: any = {
                saveUser: sinon.stub().resolves(mockUser)
            };

            const userController = new UserController(mockuserManager);
            await userController.registerUser(mockRequest, mockResponse);

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

            const mockuserManager: any = {
                saveUser: sinon.stub().rejects(new PlenuumError("Mock error", ErrorType.NOT_IMPLEMENTED))
            };

            const userController = new UserController(mockuserManager);
            await userController.registerUser(mockRequest, mockResponse);

            sinon.assert.calledWith(mockResponse.status, 501);
            sinon.assert.calledWith(mockResponse.send, {error: "Mock error"})
        })
    });

});