import UserDataController from "../../data/datacontroller/user.datacontroller";
import * as sinon from "sinon";
import SessionManager from "../../api/manager/session.manager";
import { expect } from 'chai';
import { fail } from "assert";
import { PlenuumError } from "../../util/errorhandler";

suite("SessionManager tests", () => {
    suite("checkToken", () => {
        test("Reset token was expired", async () => {
            const token = "mocktoken";
            const passedDate = new Date();
            passedDate.setHours(passedDate.getHours() - 1);

            const resetToken = {
                token_expiry: passedDate,
                reseted: false
            };

            const expectedResult = {validToken: false, reseted: false};

            const getResetToken = sinon.stub(UserDataController, "getResetToken");
            getResetToken.withArgs(token).resolves(resetToken);

            const sessionManager = new SessionManager();
            const result = await sessionManager.checkToken(token);
            getResetToken.restore();

            expect(result).to.be.deep.equal(expectedResult);

        });

        test("Reset token is not expired but reseted", async () => {
            const token = "mocktoken";
            const passedDate = new Date();
            passedDate.setHours(passedDate.getHours() + 1);

            const resetToken = {
                token_expiry: passedDate,
                reseted: true
            };

            const expectedResult = {validToken: false, reseted: true};

            const getResetToken = sinon.stub(UserDataController, "getResetToken");
            getResetToken.withArgs(token).resolves(resetToken);

            const sessionManager = new SessionManager();
            const result = await sessionManager.checkToken(token);
            getResetToken.restore();

            expect(result).to.be.deep.equal(expectedResult);

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

    suite("logout", () => {
        test("Token was removed successfully", async () => {
            const userId = "userId";
            const expectedResult = {message: "User logged out successfully"};
            const removeToken = sinon.stub(UserDataController, "removeToken");
            removeToken.withArgs(userId).resolves({success: "success"});

            const sessionManager = new SessionManager();
            const result = await sessionManager.logout(userId);
            removeToken.restore();

            expect(result).to.be.deep.equal(expectedResult);
        });

        test("Error during token removal", async () => {
            const userId = "userId";
            const removeToken = sinon.stub(UserDataController, "removeToken");
            removeToken.withArgs(userId).rejects(new Error("whatever error"));

            const sessionManager = new SessionManager();
            try {
                await sessionManager.logout(userId);
                fail("Should throw Plenuum error!")
            } catch (err) {
                expect(err).to.be.instanceOf(PlenuumError);
                expect(err.message).to.be.equal("User could not be logged out.");
                expect(err.getStatusCode()).to.be.equal(500);
            } finally {
                removeToken.restore();
            }
        });
    });

    suite("login", () => {
        //TODO Test this
    });
});