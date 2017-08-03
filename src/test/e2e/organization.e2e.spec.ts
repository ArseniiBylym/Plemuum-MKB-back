import * as request from 'supertest';
import app from "../../app";

suite("Organization request tests", () => {
    suite("Create organization", () => {
        const url = "/api/organization";
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
    })
});