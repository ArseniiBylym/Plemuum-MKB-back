import { authenticate, fixtureLoader, resetPassword, testUser } from "../mock/fixture.loader";
import * as request from "supertest";
import app from "../../app";
import * as responseValidator from "../../util/model.validator";
import { expect } from 'chai';
import { getDatabaseManager } from "../../factory/database.factory";
import config from "../../../config/config";
import { bearerAuthHeader } from "../header.helper";

suite("Session request tests", () => {

    before((done) => {
        getDatabaseManager().openConnection(config.mongoUrl)
            .then(() => fixtureLoader())
            .then(() => done())
            .catch((error) => {
                console.error(error);
                done();
            })
    });

    after(done => {
        getDatabaseManager().closeConnection()
            .then(() => done())
            .catch(() => done());
    });

    suite("Login/Logout tests", () => {
        const url = "/api/session";

        test("Login with valid credentials, should get 200", done => {
            request(app)
                .post(url)
                .query({email: testUser.email, password: testUser.password})
                .expect(200)
                .then(response => {
                    responseValidator.validateLoginResponse(response.body);
                    done();
                });
        });

        test("Login with invalid credentials, should get 401", done => {
            request(app)
                .post(url)
                .query({email: testUser.email, password: 'qwerty'})
                .expect(401, done);
        });

        test("Should be able to log out, return 200", done => {
            authenticate(testUser)
                .then(token => {
                    request(app)
                        .delete(url)
                        .set(bearerAuthHeader(token))
                        .expect(200)
                        .then(response => {
                            expect(response.body).to.haveOwnProperty('message');
                            expect(response.body.message).to.be.string("User Logged out successfully!");
                            done();
                        });
                })
        });

        test("Should get 401 if the token is invalid for logout", done => {
            authenticate(testUser)
                .then(token => {
                    request(app)
                        .delete(url)
                        .set('Authorization', `Bearer asd123`)
                        .expect(401, done)
                })
        });

        test("Should get 401 if there's no token in the header", done => {
            request(app)
                .delete(url)
                .expect(401)
                .end(done)
        });
    });

    suite("Check token request", () => {
        const url = "/api/session/validtoken";
        let token: string;
        test("Should be able to check if a token is valid", function (done) {
            // This one is pretty slow, so as a quick fix I've added a bigger timeout (todo should be fixed though)
            this.timeout(5000);
            resetPassword(testUser.email)
                .then(token =>
                    request(app)
                        .post(url)
                        .send({token: token})
                        .expect(200)
                        .then((response) => {
                            expect(response.body).to.haveOwnProperty("validToken");
                            expect(response.body).to.haveOwnProperty("reseted");
                            done();
                        })
                );
        });
    })

});