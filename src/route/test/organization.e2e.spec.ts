import * as request from 'supertest';
import app from "../../app";

describe("Organization request tests", () => {
    describe("Create organization", () => {
        const url = "/api/organization";
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
    })
});