import Organization from "../../data/models/organization/organization.model";
import CompassController from "../../controller/compass.controller";
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as Sinon from 'sinon';
import UserDataController from "../../data/datacontroller/user.datacontroller";

suite("CompassController tests", () => {

    suite("checkOrganization", () => {
        test("Should return a promise with the given organization", done => {
            const organization: Organization = {
                name: "Name",
                dbName: "NAME",
                todoSentenceNumber: 3,
                compassGenerationTime: 3
            };
            try {
                CompassController.checkOrganization(organization).then((org) => {
                    expect(org).to.be.deep.equal(organization);
                    done();
                })
            } catch (err) {
                done(err)
            }

        });

        test("Should throw any exception", done => {
            try {
                let organization: any;
                CompassController.checkOrganization(organization)
                    .then((org) => done(new Error('This should fail!')))
            } catch (err) {
                expect(err.message).to.be.equal("Organization nonexistent!");
                done()
            }
        })
    });

    suite("checkAboutUser", () => {
        test("Should return a promise with the given user", done => {
            const user: any = {
                firstName: "firstName",
                lastName: "lastName",
                email: "email",
                pictureUrl: "pictureUrl",
                orgIds: ["orgIds"]
            };
            try {
                CompassController.checkAboutUser(user).then((u: any) => {
                    expect(u).to.be.deep.equal(user);
                    done();
                })
            } catch (err) {
                done(err)
            }

        });

        test("Should throw any exception", done => {
            try {
                let user: any;
                CompassController.checkAboutUser(user)
                    .then((org) => done(new Error('This should fail!')))
            } catch (err) {
                expect(err.message).to.be.equal("User could not be found");
                done()
            }
        })
    })

    suite("getAboutUser", () => {
        test("Should call UserDataController.getUserById", done => {
            let userDataControllerStub: Sinon.SinonStub = sinon.stub(UserDataController, "getUserById").returns(Promise.resolve({}));
            CompassController.getAboutUser("dummy", "dummy");
            userDataControllerStub.restore();
            expect(userDataControllerStub.calledWith("dummy", "dummy", ['_id', 'firstName', 'lastName'])).to.be.true;
            done();
        })
    });

    suite("buildUpNewTodoResponse", () => {
        test("Should return a valid response object", done => {
            const senderId = "senderId";
            const recipientId = "recipientId";
            const organization: any = {
                todoSentenceNumber: 3
            };
            const aboutUser: any = {
                _id: "1234"
            };
            const skills: any = [
                {
                    name: "skill 1",
                    sentences: [
                        {message: "message 1"},
                        {message: "message 1"},
                        {message: "message 1"},
                    ]
                },
                {
                    name: "skill 2",
                    sentences: [
                        {message: "message 2"},
                        {message: "message 2"},
                        {message: "message 2"},
                    ]
                },
                {
                    name: "skill 3",
                    sentences: [
                        {message: "message 3"},
                        {message: "message 3"},
                        {message: "message 3"},
                    ]
                }
            ];

            CompassController.buildUpNewTodoResponse(senderId, recipientId, organization, aboutUser, skills)
                .then(value => {
                    expect(value).to.haveOwnProperty("aboutUser");
                    expect(value).to.haveOwnProperty("recipientId");
                    expect(value).to.haveOwnProperty("sender");
                    expect(value).to.haveOwnProperty("message");
                    expect(value).to.haveOwnProperty("sentences");

                    expect(value.aboutUser).to.be.equal(aboutUser._id);
                    expect(value.recipientId).to.be.equal(recipientId);
                    expect(value.sender).to.be.equal(senderId);
                    expect(value.message).to.be.equal('What do you think about this common? ' +
                        'Would be cool if you could answer some things about the common');

                    expect(value.sentences).to.be.instanceof(Array);
                    expect(value.sentences).to.have.lengthOf(3);
                    expect(value.sentences[0]).to.haveOwnProperty("message");
                    expect(value.sentences[0]).to.haveOwnProperty("skillName");

                    done();
                }).catch((err) => done(err));
        })
    })

});