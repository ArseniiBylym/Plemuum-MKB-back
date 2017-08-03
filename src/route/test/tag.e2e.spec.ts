import * as request from 'supertest';
import app from "../../app";
import { expect } from 'chai';

suite("Tag request tests", () => {
    suite("New Tag", () => {
        const orgId = 'hipteam';
        const url = `/api/${orgId}/tag`;

        test("GET: should return 200", done => {
            request(app)
                .get(url)
                .expect(200, done);
        });

        test("POST: should return 200", done => {
            request(app)
                .post(url)
                .expect(200, done);
        })
    });

    suite("Get tags", () => {
        const orgId = 'hipteam';
        const url = `/api/${orgId}/tags`;
        test("Response should contain an array and return 200", done => {
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