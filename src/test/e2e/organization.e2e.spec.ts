import * as request from 'supertest';
import app from "../../app";
import config from "../../../config/config";
import { basicAuthHeader } from "../header.helper";

suite("Organization request tests", () => {
    suite("Create organization", () => {
        const url = "/api/organization";
        const username = "admin";
        const password = config.adminPwd;
        test("GET: should return 200", done => {
            request(app)
                .get(url)
                .set(basicAuthHeader)
                .expect(200, done);
        });

        test("POST: should return 200", done => {
            request(app)
                .post(url)
                .set(basicAuthHeader)
                .expect(200, done);
        })
    })
});