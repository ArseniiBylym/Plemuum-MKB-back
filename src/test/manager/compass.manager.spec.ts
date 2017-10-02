import Organization from "../../data/models/organization/organization.model";
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as Sinon from 'sinon';
import UserDataController from "../../data/datacontroller/user.datacontroller";
import CompassDataController from "../../data/datacontroller/compass.datacontroller";
import CompassManager from "../../api/manager/compass.manager";
import StatisticsManager from "../../api/manager/statistics.manager";
import StatisticsDataController from "../../data/datacontroller/statistics.datacontroller";
import Group from "../../data/models/organization/group.model";
import { skills } from "../util/statistics.manager.util";
import { validateCompassTodo } from "../../util/model.validator";
import { fail } from "assert";
import { PlenuumError } from "../../util/errorhandler";
import FeedbackDataController from "../../data/datacontroller/feedback.datacontroller";

const dummy: any = {};

suite("CompassManager tests", () => {

    suite("getTodos", () => {

        const mockRequests = [
            {_id: 0},
            {_id: 10},
            {_id: 20},
            {_id: 0},
        ];

        let getTodosForOwner: any;
        let getFeedbacksForRequest: any;
        beforeEach(() => {
            getTodosForOwner = sinon.stub(CompassDataController, 'getTodosForOwner')
                .resolves([{dummy: "dummy"}, {dummy: "dummy"}, {dummy: "dummy"}]);
            getFeedbacksForRequest = sinon.stub(FeedbackDataController, 'getFeedbacksForRequest')
                .callsFake((orgId, requestId, userId) => requestId > 0 ? [{}, {}] : []);
        });

        afterEach(() => {
            getTodosForOwner.restore();
            getFeedbacksForRequest.restore();
        });

        test("Should have request and todo in the response", async () => {
            const requestDataController: any = {
                getRecipientRequests: sinon.stub().resolves(mockRequests)
            };
            const compassManager = new CompassManager(dummy, dummy, requestDataController);
            const result = await compassManager.getTodos("orgId", "userId");

            sinon.assert.called(getFeedbacksForRequest);
            sinon.assert.called(getTodosForOwner);

            expect(result).to.haveOwnProperty('requests');
            expect(result).to.haveOwnProperty('compassTodo');

            expect(result.requests).to.be.instanceof(Array);
            expect(result.compassTodo).to.be.instanceof(Array);

            expect(result.requests).lengthOf(2);
            expect(result.compassTodo).lengthOf(3);

        });
    });

    suite("answerCard", () => {
        const aboutUserId = "5984342227cd340363dc84c7";
        const senderId = "5984342227cd340363dc84aa";
        const orgId = "hipteam";

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
            const getOrganizationByDbName = sinon.stub();

            getUserGroups.withArgs(orgId, "5984342227cd340363dc84c7").resolves(aboutUserGroups);
            getUserGroups.withArgs(orgId, "5984342227cd340363dc84aa").resolves(senderUserGroups);
            getOrganizationByDbName.withArgs(orgId).resolves({dbName: orgId, todoSentenceNumber: 3});

            const groupDataController: any = {getUserGroups: getUserGroups};
            const organizationDataController: any = {getOrganizationByDbName: getOrganizationByDbName};

            const getSkillsByIds = sinon.stub(CompassDataController, "getSkillsByIds");
            const getAboutUser = sinon.stub(CompassManager, "getAboutUser");
            const buildUpNewTodoResponse = sinon.stub(CompassManager, "buildUpNewTodoResponse");
            const saveCompassTodo = sinon.stub(CompassDataController, "saveCompassTodo").resolves();

            getAboutUser.withArgs(orgId, aboutUserId).resolves(aboutUserId);

            getSkillsByIds.withArgs(orgId, ["5940f6044d0d550007d863df", "5940f5f44d0d550007d863dc"])
                .resolves(mockSkills);

            const compassManager = new CompassManager(groupDataController, organizationDataController, dummy);
            await compassManager.answerCard(aboutUserId, senderId, orgId);

            getSkillsByIds.restore();
            buildUpNewTodoResponse.restore();
            getAboutUser.restore();
            saveCompassTodo.restore();

            sinon.assert.calledWith(buildUpNewTodoResponse, senderId, 3, aboutUserId, mockSkills);
        });

        test("Should throw error, if the sender does not have an answerCard relation to the about user's group", (done) => {
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
            const getOrganizationByDbName = sinon.stub();

            getUserGroups.withArgs(orgId, "5984342227cd340363dc84c7").resolves(aboutUserGroups);
            getUserGroups.withArgs(orgId, "5984342227cd340363dc84aa").resolves(senderUserGroups);
            getOrganizationByDbName.withArgs(orgId).resolves({dbName: orgId});

            const groupDataController: any = {getUserGroups: getUserGroups};
            const organizationDataController: any = {getOrganizationByDbName: getOrganizationByDbName};

            const getSkillsByIds = sinon.stub(CompassDataController, "getSkillsByIds");
            const generateTodo = sinon.stub(CompassManager, "buildUpNewTodoResponse");

            const compassManager = new CompassManager(groupDataController, organizationDataController, dummy);

            compassManager.answerCard(aboutUserId, senderId, orgId)
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
                CompassManager.checkOrganization(organization);
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
                CompassManager.checkAboutUser(user);
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
        const ownerId = "ownerId";
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

            const result = CompassManager.buildUpNewTodoResponse(ownerId, organization.todoSentenceNumber, aboutUser._id, skills);

            expect(result.about).to.be.equal(aboutUser._id);
            expect(result.owner).to.be.equal(ownerId);
            validateCompassTodo(result, organization.todoSentenceNumber, true);
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

            const result = CompassManager.buildUpNewTodoResponse(ownerId, organization.todoSentenceNumber, aboutUser._id, skills);

            expect(result.about).to.be.equal(aboutUser._id);
            expect(result.owner).to.be.equal(ownerId);
            validateCompassTodo(result, organization.todoSentenceNumber, true);
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

            const result = CompassManager.buildUpNewTodoResponse(ownerId, organization.todoSentenceNumber, aboutUser._id, skills);

            expect(result.about).to.be.equal(aboutUser._id);
            expect(result.owner).to.be.equal(ownerId);
            validateCompassTodo(result, 2, true);
        })
    });

    suite("answerCompass", () => {
        test("Should call CompassDataController.saveCompassAnswer", async () => {
            const mockAnswer: any = sinon.mock;
            const savedAnswer: any = sinon.mock;
            const mockOrgId: any = sinon.mock;
            const mockStatistics: any = sinon.mock;
            const getTodoById = sinon.stub(CompassDataController, 'getTodoById').resolves({});
            const updateCompassTodo = sinon.stub(CompassDataController, 'updateCompassTodo').resolves();

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

            getTodoById.restore();
            updateCompassTodo.restore();
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

    //TODO CHECK THIS!
    suite.skip("createOrUpdateSkill", () => {
        test("Should be able to update a skill", async () => {
            const mockOrgId = "org";
            const mockSkill: any = sinon.mock();

            const updateSkill = sinon.stub(CompassDataController, 'createOrUpdateSkill').resolves(true);
            const result = await CompassManager.createOrUpdateSkill(mockOrgId, mockSkill);
            updateSkill.restore();

            expect(result).to.be.deep.equal(mockSkill);
        });

        test("Should throw error if something goes wrong with the update", (done) => {
            const mockOrgId = "org";
            const mockSkill: any = sinon.mock();

            const updateSkill = sinon.stub(CompassDataController, 'createOrUpdateSkill').throws(new Error("mock error"));
            CompassManager.createOrUpdateSkill(mockOrgId, mockSkill)
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

            const compassManager = new CompassManager(groupDataController, dummy, dummy);
            const result = await compassManager.getStatistics(orgId, userId);

            getStatistics.restore();
            saveOrUpdateStatistics.restore();
            getStatisticsByUserId.restore();
            sinon.assert.calledWith(groupDataController.getUserGroups, orgId, userId);
            expect(result).to.be.deep.equal(mockStatistics);
        })
    });

    suite("autoGenerateTodo", () => {
        test("Should get parts send them to build a todo and call save", async () => {
            const testGroups: any[] = [
                {
                    _id: "group1",
                    users: ["user1", "user2"],
                    skills: ["skill1", "skill2"],
                    todoCardRelations: ["group2"]
                },
                {
                    _id: "group2",
                    users: ["user3", "user4", "user5", "user6"],
                    skills: ["skill3", "skill4"],
                    todoCardRelations: ["group1"]
                },
                {
                    _id: "group3",
                    users: ["user7"],
                    skills: ["skill5", "skill6"],
                    todoCardRelations: ["group2"]
                },
                {
                    _id: "group4",
                    users: ["user8", "user9"],
                    skills: ["skill7"],
                    todoCardRelations: []
                },
            ];

            const groupDataController: any = {
                getGroups: sinon.stub().resolves(testGroups),
                getGroupById: sinon.stub().callsFake((orgId, groupId) => Promise.resolve(testGroups.filter((g) => g._id === groupId)[0]))
            };

            const organizationDataController: any = {
                getOrganizationByDbName: sinon.stub().resolves({
                    dbName: "orgName",
                    todoSentenceNumber: 3
                })
            };

            const getSkillsByIds = sinon.stub(CompassDataController, "getSkillsByIds");
            getSkillsByIds.callsFake((orgId, skills) => skills);

            const saveCompassTodo = sinon.stub(CompassDataController, "saveCompassTodo");

            const buildUpNewTodoResponse = sinon.stub(CompassManager, "buildUpNewTodoResponse");
            buildUpNewTodoResponse.returns({todo: "todo"});

            const compassManager = new CompassManager(groupDataController, organizationDataController, dummy);
            await compassManager.autoGenerateTodo("orgName");

            buildUpNewTodoResponse.restore();
            getSkillsByIds.restore();
            saveCompassTodo.restore();

            sinon.assert.calledWith(buildUpNewTodoResponse, sinon.match.defined, 3, sinon.match.defined, sinon.match.array);
            sinon.assert.calledWith(saveCompassTodo, "orgName", {todo: "todo"});
        });

        test("Should throw and error if there's no group with todo relation", async () => {
            const testGroups: any[] = [
                {
                    _id: "group1",
                    users: ["user1", "user2"],
                    skills: ["skill1", "skill2"],
                    todoCardRelations: []
                },
                {
                    _id: "group2",
                    users: ["user3", "user4", "user5", "user6"],
                    skills: ["skill3", "skill4"],
                    todoCardRelations: []
                },
                {
                    _id: "group3",
                    users: ["user7"],
                    skills: ["skill5", "skill6"],
                    todoCardRelations: []
                },
                {
                    _id: "group4",
                    users: ["user8", "user9"],
                    skills: ["skill7"],
                    todoCardRelations: []
                },
            ];

            const groupDataController: any = {
                getGroups: sinon.stub().resolves(testGroups),
                getGroupById: sinon.stub().callsFake((orgId, groupId) => Promise.resolve(
                    testGroups.filter((g) => g._id === groupId)[0]))
            };

            const organizationDataController: any = {
                getOrganizationByDbName: sinon.stub().resolves({
                    dbName: "orgName",
                    todoSentenceNumber: 3
                })
            };

            const compassManager = new CompassManager(groupDataController, organizationDataController, dummy);
            try {
                await compassManager.autoGenerateTodo("orgName");
                fail("Should throw and exception")
            } catch (err) {
                expect(err).to.be.instanceOf(PlenuumError);
                expect(err.getStatusCode()).to.be.equal(404);
                expect(err.message).to.be.equal("Organization has no group with Todo relations");
            }
        });
    })
});
