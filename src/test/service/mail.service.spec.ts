import { testUser } from "../mock/fixture.loader";
import * as sinon from "sinon";
import { expect } from "chai";
import { fail } from 'assert';
import EmailManager from "../../manager/email/mail.manager";
import config from "../../../config/config";

suite("Mail service tests", () => {

    const link = "mock_link";
    const email = testUser.email;
    const firstName = testUser.firstName;
    const organization: any = sinon.mock();
    let emailManager: EmailManager;
    const resultInfo = {info: "Info"};

    suite("sendSurveyNotificationEmail", () => {

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

                const options = EmailManager.getMailOptions(mockEmail, mockHtml, mockSubject, mockMessage);
                expect(options).to.be.deep.equal(mockResponse);
            });
        });

        suite("Happy cases", () => {
            beforeEach(() => {
                emailManager = new EmailManager();
            });

            test("It should send mail successfuly", async () => {
                const mockTransport = {
                    send: sinon.mock().callsFake((options, callback) => callback(null, resultInfo))
                };
                const getTransportStub = sinon.stub(EmailManager, "getTransport").returns(mockTransport);
                const result = emailManager.sendSurveyNotificationEmail(email, firstName, link, organization, mockTransport);
                getTransportStub.restore();

                expect(result).to.not.be.undefined;
            });

            test("Should use a surveyNotification email template", async () => {
                const mockTransport = {
                    send: sinon.mock().callsFake((options, callback) => callback(null, resultInfo))
                };
                const getTransportStub = sinon.stub(EmailManager, "getTransport").returns(mockTransport);
                const getMailOptions = sinon.spy(EmailManager, "getMailOptions");
                const getHtmlFromEjsSpy = sinon.spy(emailManager, "getHtmlFromEjs");
                emailManager.sendSurveyNotificationEmail(email, firstName, link, organization, mockTransport);
                getTransportStub.restore();
                getMailOptions.restore();
                getHtmlFromEjsSpy.restore();
                sinon.assert.calledWith(getHtmlFromEjsSpy, "surveyNotification.ejs", {
                    firstName: firstName,
                    company: organization,
                    email: email,
                    link: link
                });
                // sinon.assert.calledWith(getMailOptions, email);
            });
        });

        suite("Failed cases", () => {
            test("Should reject if there's an error", async () => {
                const errormessage = "mock error";
                const mockTransport = {
                    send: sinon.mock().callsFake((options, callback) => callback(new Error(errormessage), null))
                };
                const getTransportStub = sinon.stub(EmailManager, "getTransport")
                    .returns(mockTransport);

                try {
                    emailManager.sendSurveyNotificationEmail(email, firstName, link, organization, mockTransport);
                }
                catch (error) {
                    expect(error.message).to.be.equal(errormessage);
                } finally {
                    getTransportStub.restore();
                }
            });
        });
    });

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

                const options = EmailManager.getMailOptions(mockEmail, mockHtml, mockSubject, mockMessage);
                expect(options).to.be.deep.equal(mockResponse);
            });
        });

        suite("Happy cases", () => {
            beforeEach(() => {
                emailManager = new EmailManager();
            });

            test("It should send mail successfuly", async () => {
                const mockTransport = {
                    send: sinon.mock().callsFake((options, callback) => callback(null, resultInfo))
                };
                const getTransportStub = sinon.stub(EmailManager, "getTransport").returns(mockTransport);
                const result = emailManager.sendWelcomeEmail(email, firstName, link, organization, mockTransport);
                getTransportStub.restore();

                expect(result).to.not.be.undefined;
            });

            test("Should use a welcome email template", async () => {
                const mockTransport = {
                    send: sinon.mock().callsFake((options, callback) => callback(null, resultInfo))
                };
                const getTransportStub = sinon.stub(EmailManager, "getTransport").returns(mockTransport);
                const getMailOptions = sinon.spy(EmailManager, "getMailOptions");
                const getHtmlFromEjsSpy = sinon.spy(emailManager, "getHtmlFromEjs");
                emailManager.sendWelcomeEmail(email, firstName, link, organization, mockTransport);
                getTransportStub.restore();
                getMailOptions.restore();
                getHtmlFromEjsSpy.restore();
                sinon.assert.calledWith(getHtmlFromEjsSpy, "welcome.ejs", {
                    firstName: firstName,
                    company: organization,
                    email: email,
                    link: link,
                    privacyLink: `${config.webappDomain}/privacy`
                });
                // sinon.assert.calledWith(getMailOptions, email);
            });
        });

        suite("Failed cases", () => {
            test("Should reject if there's an error", async () => {
                const errormessage = "mock error";
                const mockTransport = {
                    send: sinon.mock().callsFake((options, callback) => callback(new Error(errormessage), null))
                };
                const getTransportStub = sinon.stub(EmailManager, "getTransport")
                    .returns(mockTransport);

                try {
                    emailManager.sendWelcomeEmail(email, firstName, link, organization, mockTransport);
                    fail('Should throw an error!');
                }
                catch (error) {
                    // expect(error.message).to.be.equal(errormessage);
                } finally {
                    getTransportStub.restore();
                }
            });
        });
    });

    suite("sendResetEmail", () => {

        suite("Happy cases", () => {
            beforeEach(() => {
                emailManager = new EmailManager();
            });

            test("It should send mail successfully and return info object", async () => {
                const mockTransport = {
                    send: sinon.mock().callsFake((options, callback) => callback(null, resultInfo))
                };

                const getTransportStub = sinon.stub(EmailManager, "getTransport").returns(mockTransport);
                const result = emailManager.sendResetEmail(email, link, firstName);
                getTransportStub.restore();
                expect(result).to.not.be.undefined;
            });

            test("Should use reset password template", async () => {
                const mockTransport = {
                    send: sinon.mock().callsFake((options, callback) => callback(null, resultInfo))
                };

                const getTransportStub = sinon.stub(EmailManager, "getTransport").returns(mockTransport);
                const getHtmlFromEjsSpy = sinon.spy(emailManager, "getHtmlFromEjs");
                const getMailOptions = sinon.spy(EmailManager, "getMailOptions");
                emailManager.sendResetEmail(email, link, firstName);
                getHtmlFromEjsSpy.restore();
                getTransportStub.restore();
                sinon.assert.calledWith(getHtmlFromEjsSpy, "resetpassword.ejs", {link: link, firstName:firstName});
                // sinon.assert.calledWith(getMailOptions, email);
            });
        });

        suite("Failed cases", () => {
            test("Should reject if there's an error", async () => {
                const errormessage = "mock error";
                const mockTransport = {
                    send: sinon.mock().callsFake((options, callback) => callback(new Error(errormessage), null))
                };
                const getTransportStub = sinon.stub(EmailManager, "getTransport")
                    .returns(mockTransport);

                try {
                    emailManager.sendResetEmail(email, link, firstName);
                    fail('Should throw an error!');
                }
                catch (error) {
                    // expect(error.message).to.be.equal(errormessage);
                } finally {
                    getTransportStub.restore();
                }
            });
        })
    });


});
