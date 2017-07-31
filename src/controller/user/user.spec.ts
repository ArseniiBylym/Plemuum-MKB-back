import { expect } from 'chai';
import * as request from 'request';
import { RequestResponse } from 'request';
import config from '../../../config/config';
import UserController from "./user.controller";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import * as DataControllerFactory from '../../factory/datacontroller.factory';
import { anything, instance, mock, verify, when } from "ts-mockito";
import { User } from "../../data/models/user.model";

const url = `http://localhost:${config.port}/user/save`;
const testUser: User = {
    firstName: "Kovacs",
    lastName: "Bela",
    email: `bela.kovacs@gmail.com`,
    tokens: [],
    pictureUrl: "",
    orgIds: [],
    password: "asd123"
};

let userDataController: UserDataController;
let userController: UserController;

describe("User request tests", () => {

    before((done) => {
        DataControllerFactory.getUserDataController().clearData()
            .then((state) => done())
            .catch((error) => {
                console.error(error);
                done();
            })
    });

    describe('Basic test', () => {

        before(done => {
            userDataController = mock(UserDataController);
            when(userDataController.handleUserSave())
                .thenReturn(new Promise<User>((resolve) => resolve(testUser)));
            userController = new UserController(instance(userDataController));
            done();
        });

        it("should return 200", done => {
            request.get(url, (error: any, response: RequestResponse) => {
                expect(response.statusCode).to.equal(200);
                done();
            })
        });
        it("should return a user object", done => {
            request.get(url, (error: any, response: RequestResponse, body: any) => {
                const parsedBody = JSON.parse(body);
                expect(parsedBody).have.property('firstName');
                done();
            })
        });
    })
});