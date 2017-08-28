import Organization from "../../data/models/organization/organization.model";
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as Sinon from 'sinon';
import UserDataController from "../../data/datacontroller/user.datacontroller";
import OrganizationDataController from "../../data/datacontroller/organization.datacontroller";
import CompassDataController from "../../data/datacontroller/compass.datacontroller";
import CompassManager from "../../api/manager/compass.manager";
import StatisticsManager from "../../api/manager/statistics.manager";
import StatisticsDataController from "../../data/datacontroller/statistics.datacontroller";
import Group from "../../data/models/organization/group.model";
import { skills } from "../util/statistics.manager.util";
import { validateCompassTodo } from "../../util/model.validator";

suite("CompassManager tests", () => {

    suite("answerCard", () => {
        const aboutUserId = "5984342227cd340363dc84c7";
        const senderId = "5984342227cd340363dc84aa";
        const orgId = "hipteam";
        const userId = "5984342227cd340363dc84aa";

        test("Should get the correct skills and call generateTodo", async () => {
            const aboutUserGroups: any = [
                {
                    _id: "599312971b31d008b6bd2781",
                    skills: [
                        "5940f6044d0d550007d863df",
                        "5940f5f44d0d550007d863dc"
                    ],
                    answerCardRelations: [
                        "599312a31b31d008b6bd2782",
                        "599312971b31d008b6bd2781"
                    ]
                },
                {
                    _id: "599312ac1b31d008b6bd2785",
                    skills: [
                        "5940f6144d0d550007d863e2"
                    ],
                    answerCardRelations: []
                },
            ];

            const senderUserGroups: any = [
                {
                    _id: "599312a31b31d008b6bd2782",
                    skills: [
                        "5940f6044d0d550007d863df",
                        "5940f6144d0d550007d863e2"
                    ],
                    answerCardRelations: [
                        "599312971b31d008b6bd2781"
                    ]
                }

            ];
            const mockSkills = sinon.mock();
            const getUserGroups = sinon.stub();
            getUserGroups.withArgs(orgId, "5984342227cd340363dc84c7").resolves(aboutUserGroups);
            getUserGroups.withArgs(orgId, "5984342227cd340363dc84aa").resolves(senderUserGroups);


            const groupDataController: any = {getUserGroups: getUserGroups};

            const getSkillsByIds = sinon.stub(CompassDataController, "getSkillsByIds");
            const generateTodo = sinon.stub(CompassManager, "generateTodo");

            getSkillsByIds.withArgs(orgId, ["5940f6044d0d550007d863df", "5940f5f44d0d550007d863dc"])
                .resolves(mockSkills);

            const compassManager = new CompassManager(groupDataController);
            const result = await compassManager.answerCard(aboutUserId, senderId, orgId, userId);

            getSkillsByIds.restore();
            generateTodo.restore();

            sinon.assert.calledWith(generateTodo, aboutUserId, senderId, orgId, userId, mockSkills);
        });

        test.only("Should throw error, if the sender does not have an answerCard relation to the about user's group", (done) => {
            const aboutUserGroups: any = [
                {
                    _id: "599312ac1b31d008b6bd2785",
                    skills: [
                        "5940f6144d0d550007d863e2"
                    ],
                    answerCardRelations: []
                },
            ];

            const senderUserGroups: any = [
                {
                    _id: "599312a31b31d008b6bd2782",
                    skills: [
                        "5940f6044d0d550007d863df",
                        "5940f6144d0d550007d863e2"
                    ],
                    answerCardRelations: [
                        "599312971b31d008b6bd2781"
                    ]
                }

            ];

            const getUserGroups = sinon.stub();
            getUserGroups.withArgs(orgId, "5984342227cd340363dc84c7").resolves(aboutUserGroups);
            getUserGroups.withArgs(orgId, "5984342227cd340363dc84aa").resolves(senderUserGroups);


            const groupDataController: any = {getUserGroups: getUserGroups};

            const getSkillsByIds = sinon.stub(CompassDataController, "getSkillsByIds");
            const generateTodo = sinon.stub(CompassManager, "generateTodo");

            const compassManager = new CompassManager(groupDataController);

            compassManager.answerCard(aboutUserId, senderId, orgId, userId)
                .then(() => {
                    getSkillsByIds.restore();
                    generateTodo.restore();
                    done(new Error('This case answerCard should throw an error'));
                })
                .catch((error) => {
                    getSkillsByIds.restore();
                    generateTodo.restore();
                    expect(error.message).to.be.equal("Sender has no answer card relation to this user");
                    done();
                });
        })
    });

    suite("generateTodo", () => {
        test("Should return a promise with a saved compass todo", done => {
            const getOrganizationByDbNameStub = sinon.stub(OrganizationDataController, "getOrganizationByDbName")
                .resolves({dbName: "mockOrganization"});
            const getAboutUserStub = sinon.stub(CompassManager, "getAboutUser").resolves({_id: "aboutUserId"});
            const buildUpNewTodoResponseStub = sinon.stub(CompassManager, "buildUpNewTodoResponse").resolves([]);
            const saveCompassTodoStub = sinon.stub(CompassDataController, "saveCompassTodo").resolves({result: "result"});

            CompassManager.generateTodo("", "", "", "", [])
                .then((result) => {
                    expect(result).to.be.deep.equal({result: "result"});

                    getOrganizationByDbNameStub.restore();
                    getAboutUserStub.restore();
                    buildUpNewTodoResponseStub.restore();
                    saveCompassTodoStub.restore();

                    expect(getOrganizationByDbNameStub.calledOnce).to.be.true;
                    expect(getAboutUserStub.calledOnce).to.be.true;
                    expect(buildUpNewTodoResponseStub.calledOnce).to.be.true;
                    expect(saveCompassTodoStub.calledOnce).to.be.true;

                    done();
                })
                .catch((err) => done(err));
        })
    });

    suite("checkOrganization", () => {
        test("Should return a promise with the given organization", done => {
            const organization: Organization = {
                name: "Name",
                dbName: "NAME",
                todoSentenceNumber: 3,
                compassGenerationTime: 3
            };
            try {
                const result = CompassManager.checkOrganization(organization);
                expect(result).to.be.deep.equal(organization);
                done();
            } catch (err) {
                done(err)
            }

        });

        test("Should throw any exception", done => {
            try {
                let organization: any = undefined;
                const result = CompassManager.checkOrganization(organization);
                done(new Error('This should fail!'));
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
                const result = CompassManager.checkAboutUser(user);
                expect(result).to.be.deep.equal(user);
                done();
            } catch (err) {
                done(err)
            }

        });

        test("Should throw any exception", done => {
            try {
                let user: any = undefined;
                const result = CompassManager.checkAboutUser(user);
                done(new Error('This should fail!'))
            } catch (err) {
                expect(err.message).to.be.equal("User could not be found");
                done()
            }
        })
    });

    suite("getAboutUser", () => {
        test("Should call UserDataController.getUserById", async () => {
            let userDataControllerStub: Sinon.SinonStub = sinon.stub(UserDataController, "getUserById").returns(Promise.resolve({}));
            await CompassManager.getAboutUser("dummy", "dummy");
            userDataControllerStub.restore();
            expect(userDataControllerStub.calledWith("dummy", "dummy", ['_id', 'firstName', 'lastName'])).to.be.true;
        })
    });

    suite("buildUpNewTodoResponse", () => {
        const senderId = "senderId";
        const recipientId = "recipientId";
        const organization: any = {
            todoSentenceNumber: 3
        };
        const aboutUser: any = {
            _id: "1234"
        };

        test("Should return a valid response object", () => {
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

            const result = CompassManager.buildUpNewTodoResponse(senderId, recipientId, organization, aboutUser, skills);

            expect(result.about).to.be.equal(aboutUser._id);
            expect(result.recipient).to.be.equal(recipientId);
            expect(result.createdBy).to.be.equal(senderId);
            validateCompassTodo(result, organization.todoSentenceNumber);
        });

        test("Should work even if there's less skill then the todoSentenceNumber", () => {
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
                }
            ];

            const result = CompassManager.buildUpNewTodoResponse(senderId, recipientId, organization, aboutUser, skills);

            expect(result.about).to.be.equal(aboutUser._id);
            expect(result.recipient).to.be.equal(recipientId);
            expect(result.createdBy).to.be.equal(senderId);
            validateCompassTodo(result, organization.todoSentenceNumber);
        });

        test("If the number of possible sentences is less than the todoSentenceNumber, then return less sentence", () => {
            const skills: any = [
                {
                    name: "skill 1",
                    sentences: [
                        {message: "message 1"},
                    ]
                },
                {
                    name: "skill 2",
                    sentences: [
                        {message: "message 2"},
                    ]
                }
            ];

            const result = CompassManager.buildUpNewTodoResponse(senderId, recipientId, organization, aboutUser, skills);

            expect(result.about).to.be.equal(aboutUser._id);
            expect(result.recipient).to.be.equal(recipientId);
            expect(result.createdBy).to.be.equal(senderId);
            validateCompassTodo(result, 2);
        })
    });

    suite("answerCompass", () => {
        test("Should call CompassDataController.saveCompassAnswer", async () => {
            const mockAnswer: any = sinon.mock;
            const savedAnswer: any = sinon.mock;
            const mockOrgId: any = sinon.mock;
            const mockStatistics: any = sinon.mock;
            const saveCompassAnswer = sinon.stub(CompassDataController, 'saveCompassAnswer');
            saveCompassAnswer
                .withArgs(mockOrgId, mockAnswer)
                .resolves(savedAnswer);

            const createOrUpdateStatistics = sinon.stub(StatisticsManager, 'createOrUpdateStatistics');
            createOrUpdateStatistics
                .withArgs(mockOrgId, savedAnswer)
                .resolves(mockStatistics);

            const saveOrUpdateStatistics = sinon.stub(StatisticsDataController, 'saveOrUpdateStatistics');
            saveOrUpdateStatistics
                .withArgs(mockOrgId, mockStatistics)
                .resolves(mockStatistics);

            const result = await CompassManager.answerCompass(mockOrgId, mockAnswer);

            saveCompassAnswer.restore();
            createOrUpdateStatistics.restore();
            saveOrUpdateStatistics.restore();

            expect(result).to.be.deep.equal(savedAnswer);
        })
    });

    suite("createNewSkill", () => {
        test("Should call CompassDataController.saveSkill and return the saved skill object", async () => {
            const mockOrgId: any = sinon.mock();
            const mockSkill = {
                name: "Mock Skill",
                sentences: [{
                    message: "Mock sentence message"
                }],
                inactiveSentences: []
            };
            const saveSkill = sinon.stub(CompassDataController, 'saveSkill').resolves();
            await CompassManager.createNewSkill(mockOrgId, mockSkill);
            sinon.assert.calledWith(saveSkill, mockOrgId, mockSkill);
            saveSkill.restore();
        })
    });

    suite("updateSkill", () => {
        test("Should be able to update a skill", async () => {
            const mockOrgId = "org";
            const mockSkill: any = sinon.mock();

            const updateSkill = sinon.stub(CompassDataController, 'updateSkill').resolves(true);
            const getSkillById = sinon.stub(CompassDataController, 'getSkillById').resolves(mockSkill);
            const result = await CompassManager.updateSkill(mockOrgId, mockSkill);
            updateSkill.restore();
            getSkillById.restore();

            expect(updateSkill.calledWith(mockOrgId, mockSkill)).to.be.true;
            expect(getSkillById.calledWith(mockOrgId, mockSkill._id)).to.be.true;
            expect(result).to.be.deep.equal(mockSkill);
        });

        test("Should throw error if something goes wrong with the update", (done) => {
            const mockOrgId = "org";
            const mockSkill: any = sinon.mock();

            const updateSkill = sinon.stub(CompassDataController, 'updateSkill').throws(new Error("mock error"));
            CompassManager.updateSkill(mockOrgId, mockSkill)
                .catch(reason => {
                    updateSkill.restore();
                    expect(updateSkill.calledWith(mockOrgId, mockSkill)).to.be.true;
                    expect(reason).to.be.instanceof(Error);
                    expect(reason.message).to.be.deep.equal("mock error");
                    done();
                });
        })
    });

    suite("getStatistics", () => {
        const orgId = "orgId";
        const userId = "userId";

        test("Should collect user groups, get statistics, save and return", async () => {
            const mockStatistics: any = sinon.mock();
            const groups: Group[] = [
                {
                    name: "Group name",
                    users: [userId],
                    answerCardRelations: [],
                    todoCardRelations: [],
                    skills: [skills[0]._id, skills[2]._id]
                },
                {
                    name: "Group name 2",
                    users: [userId],
                    answerCardRelations: [],
                    todoCardRelations: [],
                    skills: [skills[1]._id]
                }
            ];

            const groupDataController: any = {
                getUserGroups: sinon.stub()
            };
            groupDataController.getUserGroups.withArgs(orgId, userId).resolves(groups);
            const getStatistics = sinon.stub(StatisticsManager, 'getStatistics');
            getStatistics.withArgs(orgId, userId, groups).resolves(mockStatistics);

            const saveOrUpdateStatistics = sinon.stub(StatisticsDataController, 'saveOrUpdateStatistics');
            saveOrUpdateStatistics.withArgs(orgId, mockStatistics).resolves(mockStatistics);
            const getStatisticsByUserId = sinon.stub(StatisticsDataController, 'getStatisticsByUserId');
            getStatisticsByUserId.withArgs(orgId, userId).resolves(mockStatistics);

            const compassManager = new CompassManager(groupDataController);
            const result = await compassManager.getStatistics(orgId, userId);

            getStatistics.restore();
            saveOrUpdateStatistics.restore();
            getStatisticsByUserId.restore();
            sinon.assert.calledWith(groupDataController.getUserGroups, orgId, userId);
            expect(result).to.be.deep.equal(mockStatistics);
        })
    })
});
