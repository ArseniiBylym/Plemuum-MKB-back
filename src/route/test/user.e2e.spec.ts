import {expect} from 'chai';
import * as request from 'request';
import {RequestResponse} from 'request';
import config from '../../../config/config';
import UserDataController from "../../data/datacontroller/user.datacontroller";
import * as DataControllerFactory from '../../factory/datacontroller.factory';
import UserController from "../../controller/user/user.controller";

const url = `http://localhost:${config.port}/user/save`;
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
    });
});