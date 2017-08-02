import * as request from 'supertest';
import app from "../../app";
import { expect } from 'chai';

describe("Tag request tests", () => {
    describe("New Tag", () => {
        const orgId = 'hipteam';
        const url = `/api/${orgId}/tag`;

        it("GET: should return 200", done => {
            request(app)
                .get(url)
                .expect(200, done);
        });

        it("POST: should return 200", done => {
            request(app)
                .post(url)
                .expect(200, done);
        })
    });

    describe("Get tags", () => {
        const orgId = 'hipteam';
        const url = `/api/${orgId}/tags`;
        it("Response should contain an array and return 200", done => {
            request(app)
                .get(url)
                .expect(200)
                .then(response => {
                    expect(response.body).to.be.an.instanceOf(Array);
                    done();
                });
        })
    })
});