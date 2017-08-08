import * as request from 'supertest';
import app from "../../app";
import { assert, expect } from 'chai';
import { authenticate, fixtureLoader, testUser } from "../mock/fixture.loader";
import * as modelValidator from "../../util/model.validator";

suite("Tag request tests", () => {

    before((done) => {
        fixtureLoader()
            .then(value => done())
            .catch((error) => {
                console.error(error);
                done();
            })
    });

    suite("New Tag", () => {
        const orgId = 'hipteam';
        const url = `/api/${orgId}/tag`;

        test("GET: should return 200", done => {
            request(app)
                .get(url)
                .expect(200, done);
        });

        test("POST: should return 201", done => {
            request(app)
                .post(url)
                .send({title: "TestTagTitle"})
                .expect(201)
                .then(response => {
                    modelValidator.validateTagResponse(response.body);
                    done();
                })
        });

        test("POST: should not be able to post a tag with an already existing title", done => {
            request(app)
                .post(url)
                .send({title: "TestTitle"})
                .expect(400)
                .then(response => {
                    expect(response.body).to.haveOwnProperty("error");
                    expect(response.body.error).to.be.equal("This tag already exist");
                    done();
                })
        })
    });

    suite("Get tags", () => {
        const orgId = 'hipteam';
        const url = `/api/${orgId}/tags`;
        test("Response should contain an array and return 200", done => {
            authenticate(testUser)
                .then(token => {
                    request(app)
                        .get(url)
                        .set('Authorization', `Bearer ${token}`)
                        .expect(200)
                        .then(response => {
                            expect(response.body).to.be.an.instanceOf(Array);
                            assert(response.body.length > 0);
                            modelValidator.validateTagResponse(response.body[0]);
                            done();
                        });
                });
        })
    })
});