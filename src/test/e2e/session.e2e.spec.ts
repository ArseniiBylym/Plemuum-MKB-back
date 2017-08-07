import { authenticate, fixtureLoader, testUser } from "../mock/fixture.loader";
import * as request from "supertest";
import app from "../../app";
import * as responseValidator from "../../util/model.validator";

// TODO Finish this
suite("Session request tests", () => {

    let testToken: string;

    before((done) => {
        fixtureLoader()
            .then(() => done())
            .catch((error) => {
                console.error(error);
                done();
            })
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
                        .set('Authorization', `Bearer ${token}`)
                        .expect(200)
                        .then(response => {
                            done();
                        });
                })
        })
    });

    suite("Check token request", () => {
        const url = "/api/session/validtoken";
        test("Should be able to check if a token is valid", done => {
            request(app)
                .post(url)
                .expect(200, done);
        });
    })

});