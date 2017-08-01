import { expect } from 'chai';
import * as request from 'request';
import { RequestResponse } from 'request';
import config from '../../../config/config';
import UserDataController from "../../data/datacontroller/user.datacontroller";
import * as DataControllerFactory from '../../factory/datacontroller.factory';
import UserController from "../../controller/user/user.controller";


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

    describe('Create new user', () => {

        const url = `http://localhost:${config.port}/api/register/user`;

        it('POST: Should return 200 and an empty object', done => {
            request.post(url, {}, (error: any, response: RequestResponse, body: any) => {
                expect(response.statusCode).to.equal(200);
                done();
            })
        });

        it("POST: Should return a user object", done => {
            request.post(url, (error: any, response: RequestResponse, body: any) => {
                const parsedBody = JSON.parse(body);
                expect(parsedBody).have.property('firstName');
                done();
            })
        });

        it('GET: Should return 200', done => {
            request.get(url, (error: any, response: RequestResponse, body: any) => {
                expect(response.statusCode).to.equal(200);
                done();
            })
        })
    });

    describe('Get all users from organization', () => {

        const orgId = "1234";
        const url = `http://localhost:${config.port}/api/${orgId}/users`;

        it('Should return 200', done => {
            request.get(url, (error: any, response: RequestResponse, body: any) => {
                expect(response.statusCode).to.equal(200);
                done();
            })
        });

        it('Response should return the organization id', done => {
            request.get(url, (error: any, response: RequestResponse, body: any) => {
                const parsedBody = JSON.parse(body);
                expect(parsedBody).have.property('orgId');
                expect(parsedBody.orgId).to.be.equal(orgId);
                done();
            })
        })
    });

    describe('Get one user from organization', () => {

        const orgId = "1234";
        const userId = "1234";
        const url = `http://localhost:${config.port}/api/${orgId}/user/${userId}`;

        it('Should return 200', done => {
            request.get(url, (error: any, response: RequestResponse, body: any) => {
                expect(response.statusCode).to.equal(200);
                done();
            })
        });

        it('Response should return the organization id', done => {
            request.get(url, (error: any, response: RequestResponse, body: any) => {
                const parsedBody = JSON.parse(body);
                expect(parsedBody).have.property('orgId');
                expect(parsedBody.orgId).to.be.equal(orgId);
                expect(parsedBody).have.property('userId');
                expect(parsedBody.orgId).to.be.equal(userId);
                done();
            })
        })
    });

    describe('Reset user password', () => {

        const url = `http://localhost:${config.port}/api/resetPassword`;

        it('Should return 200', done => {
            request.post(url, (error: any, response: RequestResponse, body: any) => {
                expect(response.statusCode).to.equal(200);
                done();
            })
        });
    });

    describe('Set password', () => {

        const url = `http://localhost:${config.port}/api/setPassword`;

        it('Should return 200', done => {
            request.post(url, (error: any, response: RequestResponse, body: any) => {
                expect(response.statusCode).to.equal(200);
                done();
            })
        });
    });

    describe('Change password', () => {

        const url = `http://localhost:${config.port}/api/user/password`;

        it('Should return 200', done => {
            request.post(url, (error: any, response: RequestResponse, body: any) => {
                expect(response.statusCode).to.equal(200);
                done();
            })
        });
    });

    describe('Change user picture', () => {

        const url = `http://localhost:${config.port}/api/profile/setpicture`;

        it('Should return 200', done => {
            request.post(url, (error: any, response: RequestResponse, body: any) => {
                expect(response.statusCode).to.equal(200);
                done();
            })
        });
    })
});