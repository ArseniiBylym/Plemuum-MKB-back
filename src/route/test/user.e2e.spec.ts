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

suite("User request tests", () => {

    before((done) => {
        DataControllerFactory.getUserDataController().clearData()
            .then((state) => done())
            .catch((error) => {
                console.error(error);
                done();
            })
    });

    suite('Create new user', () => {

        const url = `/api/register/user`;

        test("POST: Correct request response should contain a user and return 201", done => {
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

        test('GET: Should return 200', done => {
            request(app)
                .get(url)
                .expect(200, done);
        });
    });
    suite('Get all users from organization', () => {
        const orgId = "1234";
        const url = `/api/${orgId}/users`;

        test('Response should return the organization id and return 200', done => {
            request(app)
                .get(url)
                .expect(200)
                .then(response => {
                    expect(response.body).to.be.an.instanceOf(Array);
                    done();
                });
        })
    });
    suite('Get one user from organization', () => {
        const orgId = "hipteam";
        const userId = "59809fbb45fc8436263ce1ec";
        const url = `/api/${orgId}/user/${userId}`;

        test('Should return 200', done => {
            request(app)
                .get(url)
                .expect(200, done);
        });
    });

    suite('Reset user password', () => {
        const url = `/api/resetPassword`;

        test('Should return 200', done => {
            request(app)
                .post(url)
                .expect(200, done);
        });
    });

    suite('Set password', () => {
        const url = `/api/setPassword`;

        test('Should return 200', done => {
            request(app)
                .post(url)
                .expect(200, done);
        });
    });

    suite('Change password', () => {
        const url = `/api/user/password`;

        test('Should return 200', done => {
            request(app)
                .post(url)
                .expect(200, done);
        });
    });

    suite('Change user picture', () => {
        const url = `/api/profile/setpicture`;

        test('Should return 200', done => {
            request(app)
                .post(url)
                .expect(200, done);
        });
    })
});