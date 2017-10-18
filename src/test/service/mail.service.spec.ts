import EmailService from "../../service/email/mail.service";
import { testUser } from "../mock/fixture.loader";
import * as sinon from "sinon";
import { expect } from "chai";
import { fail } from 'assert';

suite("Mail service tests", () => {

    const link = "mock_link";
    const email = testUser.email;
    const firstName = testUser.firstName;
    const organization: any = sinon.mock();
    let emailService: EmailService;
    const resultInfo = {info: "Info"};

    suite("sendWelcomeEmail", () => {

        suite("Get Options", () => {
            test("Should get the options correctly", () => {
                const mockEmail = "mock email";
                const mockHtml = "mock html";
                const mockSubject = "mock subject";
                const mockMessage = "mock message";
                const mockResponse = {
                    from: 'bot@plenuum.com',
                    to: mockEmail,
                    subject: mockSubject,
                    text: mockMessage,
                    html: mockHtml
                };

                const options = EmailService.getMailOptions(mockEmail, mockHtml, mockSubject, mockMessage);
                expect(options).to.be.deep.equal(mockResponse);
            });
        });

        suite("Happy cases", () => {
            beforeEach(() => {
                emailService = new EmailService();
            });

            test("It should send mail successfuly", async () => {
                const mockTransport = {
                    sendMail: sinon.mock().callsFake((options, callback) => callback(null, resultInfo))
                };
                const getTransportStub = sinon.stub(EmailService, "getTransport").returns(mockTransport);
                const result = await emailService.sendWelcomeEmail(email, firstName, link, organization);
                getTransportStub.restore();

                expect(result).to.not.be.undefined;
            });

            test("Should use a welcome email template", async () => {
                const mockTransport = {
                    sendMail: sinon.mock().callsFake((options, callback) => callback(null, resultInfo))
                };
                const getTransportStub = sinon.stub(EmailService, "getTransport").returns(mockTransport);
                const getMailOptions = sinon.spy(EmailService, "getMailOptions");
                const getHtmlFromEjsSpy = sinon.spy(emailService, "getHtmlFromEjs");
                await emailService.sendWelcomeEmail(email, firstName, link, organization);
                getTransportStub.restore();
                getMailOptions.restore();
                getHtmlFromEjsSpy.restore();
                sinon.assert.calledWith(getHtmlFromEjsSpy, "welcome.ejs", {
                    firstName: firstName,
                    company: organization,
                    email: email,
                    link: link
                });
                sinon.assert.calledWith(getMailOptions, email);
            });
        });

        suite("Failed cases", () => {
            test("Should reject if there's an error", async () => {
                const errormessage = "mock error";
                const mockTransport = {
                    sendMail: sinon.mock().callsFake((options, callback) => callback(new Error(errormessage), null))
                };
                const getTransportStub = sinon.stub(EmailService, "getTransport")
                    .returns(mockTransport);

                try {
                    await emailService.sendWelcomeEmail(email, firstName, link, organization);
                    fail('Should throw an error!');
                }
                catch (error) {
                    expect(error.message).to.be.equal(errormessage);
                } finally {
                    getTransportStub.restore();
                }
            });
        });
    });

    suite("sendResetEmail", () => {

        suite("Happy cases", () => {
            beforeEach(() => {
                emailService = new EmailService();
            });

            test("It should send mail successfully and return info object", async () => {
                const mockTransport = {
                    sendMail: sinon.mock().callsFake((options, callback) => callback(null, resultInfo))
                };

                const getTransportStub = sinon.stub(EmailService, "getTransport").returns(mockTransport);
                const result = await emailService.sendResetEmail(email, link);
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
                await emailService.sendResetEmail(email, link);
                getHtmlFromEjsSpy.restore();
                getTransportStub.restore();
                sinon.assert.calledWith(getHtmlFromEjsSpy, "resetpassword.ejs", {link: link});
                sinon.assert.calledWith(getMailOptions, email);
            });
        });

        suite("Failed cases", () => {
            test("Should reject if there's an error", async () => {
                const errormessage = "mock error";
                const mockTransport = {
                    sendMail: sinon.mock().callsFake((options, callback) => callback(new Error(errormessage), null))
                };
                const getTransportStub = sinon.stub(EmailService, "getTransport")
                    .returns(mockTransport);

                try {
                    await emailService.sendResetEmail(email, link);
                    fail('Should throw an error!');
                }
                catch (error) {
                    expect(error.message).to.be.equal(errormessage);
                } finally {
                    getTransportStub.restore();
                }
            });
        })
    });
});