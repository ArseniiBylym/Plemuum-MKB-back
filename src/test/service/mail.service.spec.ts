import EmailService from "../../service/email/mail.service";
import { testUser} from "../mock/fixture.loader";
import * as sinon from "sinon";
import { expect } from "chai";
import {callback} from "testdouble";
import { fail } from 'assert';

suite.only("Mail service tests", () => {

    const link = "mock_link";
    const email = testUser.email;
    let emailService: EmailService;
    const resultInfo = {info: "Info"};

    suite("sendResetEmail", () => {

        beforeEach(() => { emailService = new EmailService(); })

        test("It should send mail successfully and return info object", async () => {
            const mockTransport = {
                sendMail: sinon.mock().callsFake((options, callback) => callback(null, resultInfo))
            };

            const getTransportStub = sinon.stub(EmailService, "getTransport").returns(mockTransport);
            const result = await emailService.sendResetEmail(email, link)
            getTransportStub.restore();
            expect(result).to.not.be.undefined;
        });

        test("Should use reset password template", async () => {
            const mockTransport = {
                sendMail: sinon.mock().callsFake((options, callback) => callback(null, resultInfo))
            };

            const getTransportStub = sinon.stub(EmailService, "getTransport").returns(mockTransport);
            const getHtmlFromEjsSpy = sinon.spy(emailService, "getHtmlFromEjs");
            const getMailOptions = sinon.spy(EmailService, "getMailOptions");
            await emailService.sendResetEmail(email, link)
            getHtmlFromEjsSpy.restore();
            getTransportStub.restore();
            sinon.assert.calledWith(getHtmlFromEjsSpy, "resetpassword.ejs", {link: link})
            sinon.assert.calledWith(getMailOptions, email);
        });
    });

    suite("Error cases for sendResetEmail", () => {
        test("Should reject if there's an error", async () => {
            const errormessage = "mock error";
            const mockTransport = {
                sendMail: sinon.mock().callsFake((options, callback) => callback(new Error(errormessage), null))
            };
            const getTransportStub = sinon.stub(EmailService, "getTransport")
                .returns(mockTransport);

            try{
                await emailService.sendResetEmail(email, link);
                fail('Should throw an error!');
            }
            catch (error){
                expect(error.message).to.be.equal(errormessage);
            }finally {
                getTransportStub.restore();
            }
        });
    })
});