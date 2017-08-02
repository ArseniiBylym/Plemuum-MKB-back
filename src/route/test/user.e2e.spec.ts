import app from '../../app';
import { expect } from 'chai';
import * as request from 'supertest';
import UserDataController from "../../data/datacontroller/user.datacontroller";
import * as DataControllerFactory from '../../factory/datacontroller.factory';
import UserController from "../../controller/user/user.controller";
import * as TestObjectFactory from "../../util/testobject.factory"
import * as modelValidator from "../../util/model.validator"

let userDataController: UserDataController;
let userController: UserController;

function getUserForm() {
    return {
        form: TestObjectFactory.getRegisterJohnDoe()
    }
}

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

        const url = `/api/register/user`;

        it("POST: Correct request response should contain a user and return 201", done => {
            request(app)
                .post(url)
                .send(TestObjectFactory.getRegisterJohnDoe())
                .expect(201)
                .then(response => {
                    modelValidator.validateUser(response.body);
                    done();
                })
                .catch(reason => done(reason));
        });

        it('GET: Should return 200', done => {
            request(app)
                .get(url)
                .expect(200, done);
        });
    });
    describe('Get all users from organization', () => {
        const orgId = "1234";
        const url = `/api/${orgId}/users`;

        it('Response should return the organization id and return 200', done => {
            request(app)
                .get(url)
                .expect(200)
                .then(response => {
                    expect(response.body).to.be.an.instanceOf(Array);
                    done();
                });
        })
    });
    describe('Get one user from organization', () => {
        const orgId = "hipteam";
        const userId = "59809fbb45fc8436263ce1ec";
        const url = `/api/${orgId}/user/${userId}`;

        it('Should return 200', done => {
            request(app)
                .get(url)
                .expect(200, done);
        });
    });

    describe('Reset user password', () => {
        const url = `/api/resetPassword`;

        it('Should return 200', done => {
            request(app)
                .post(url)
                .expect(200, done);
        });
    });

    describe('Set password', () => {
        const url = `/api/setPassword`;

        it('Should return 200', done => {
            request(app)
                .post(url)
                .expect(200, done);
        });
    });

    describe('Change password', () => {
        const url = `/api/user/password`;

        it('Should return 200', done => {
            request(app)
                .post(url)
                .expect(200, done);
        });
    });

    describe('Change user picture', () => {
        const url = `/api/profile/setpicture`;

        it('Should return 200', done => {
            request(app)
                .post(url)
                .expect(200, done);
        });
    })
});