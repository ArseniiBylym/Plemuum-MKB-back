import UserDataController from "../../data/datacontroller/user.datacontroller";
import * as sinon from "sinon";
import SessionManager from "../../api/manager/session.manager";
import { expect } from 'chai';
import { fail } from "assert";

suite("SessionManager tests", () => {
    suite("checkToken", () => {
        test("Reset token was expired", async () => {
            const token = "mocktoken";
            const passedDate = new Date();
            passedDate.setHours(passedDate.getHours() - 1);

            const resetToken = {token_expiry: passedDate, reseted: false};
            const getResetToken = sinon.stub(UserDataController, "getResetToken");
            getResetToken.withArgs(token).resolves(resetToken);
            const sessionManager = new SessionManager();

            try {
                await sessionManager.checkToken(token);
                fail('The token is still valid or not reseted');
            } catch (error) {
                expect(error.message).to.be.equal('Token is not valid anymore.');
                expect(error.getStatusCode()).to.be.equal(511);
            }

            getResetToken.restore();
        });

        test("Reset token is not expired but reseted", async () => {
            const token = "mocktoken";
            const passedDate = new Date();
            passedDate.setHours(passedDate.getHours() + 1);
            const resetToken = {token_expiry: passedDate, reseted: true};
            const getResetToken = sinon.stub(UserDataController, "getResetToken");
            getResetToken.withArgs(token).resolves(resetToken);
            const sessionManager = new SessionManager();

            try {
                await sessionManager.checkToken(token);
                fail('The token is still valid or not reseted');
            } catch (error) {
                expect(error.message).to.be.equal('Token is not valid anymore.');
                expect(error.getStatusCode()).to.be.equal(511);
            }
            getResetToken.restore();
        });

        test("Reset token is not expired and is not reseted", async () => {
            const token = "mocktoken";
            const passedDate = new Date();
            passedDate.setHours(passedDate.getHours() + 1);

            const resetToken = {
                token_expiry: passedDate,
                reseted: false
            };

            const expectedResult = {validToken: true, reseted: false};

            const getResetToken = sinon.stub(UserDataController, "getResetToken");
            getResetToken.withArgs(token).resolves(resetToken);

            const sessionManager = new SessionManager();
            const result = await sessionManager.checkToken(token);
            getResetToken.restore();

            expect(result).to.be.deep.equal(expectedResult);
        });
    });

    suite("login", () => {
        //TODO Test this
    });
});