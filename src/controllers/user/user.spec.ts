import { expect } from 'chai';
import * as request from 'request';
import { RequestResponse } from 'request';
import config from '../../../config/config'
import { User } from '../../data/models/user.model'

const url = `http://localhost:${config.port}/user/save`;

describe("User request tests", () => {
    describe('Basic test', () => {
        it("should return 200", done => {
            request.get(url, (error: any, response: RequestResponse) => {
                expect(response.statusCode).to.equal(200);
                done();
            })
        })
        it("should return a user object", done => {
            request.get(url, (error: any, response: RequestResponse, body: any) => {
                const parsedBody = JSON.parse(body);
                expect(parsedBody).have.property('firstName');
                done();
            })
        })
    })
});