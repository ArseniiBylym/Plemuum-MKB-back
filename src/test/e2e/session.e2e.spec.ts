import { fixtureLoader } from "../mock/fixture.loader";
import * as request from "supertest";
import app from "../../app";
import * as responseValidator from "../../util/model.validator";

// TODO Finish this
suite.only("Session request tests", () => {
    before((done) => {
        fixtureLoader()
            .then(value => done())
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
                .query({email: 'sheryl.grant@example.com', password: 'asd1234'})
                .expect(200)
                .then(response => {
                    responseValidator.validateLoginResponse(response.body);
                    done();
                });
        });

        test("Login with invalid credentials, should get 401", done => {
            request(app)
                .post(url)
                .query({email: 'sheryl.grant@example.com', password: 'qwerty'})
                .expect(401, done);
        });

        test("Should be able to log out, return 200", done => {
            request(app)
                .delete(url)
                .expect(200, done);
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