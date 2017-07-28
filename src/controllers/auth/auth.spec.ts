import { expect } from 'chai';
import * as request from 'request';
import { RequestResponse } from 'request';
import config from '../../../config/config'

const url = `http://localhost:${config.port}/login`;

describe("Login request tests", () => {
    describe('Basic test', () => {
        it("should return 200", done => {
            request.get(url, (error: any, response: RequestResponse) => {
                expect(response.statusCode).to.equal(200);
                done();
            })
        })
    })
});