import Organization from "../../data/models/organization/organization.model";
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import * as Sinon from 'sinon';
import UserDataController from "../../data/datacontroller/user.datacontroller";
import CompassDataController from "../../data/datacontroller/compass.datacontroller";
import CompassManager from "../../api/manager/compass.manager";
import StatisticsDataController from "../../data/datacontroller/statistics.datacontroller";
import Group from "../../data/models/organization/group.model";
import { createSentence, createSkill, createSkillScore, skills } from "../util/statistics.manager.util";
import { validateCompassTodo } from "../../util/model.validator";
import { fail } from "assert";
import FeedbackDataController from "../../data/datacontroller/feedback.datacontroller";
import { getScenarioOneGroups, getScenarioOneSkills, getScenarioOneUsers, } from "../util/test-scenerios";
import { getRandomItem } from "../util/utils";
import { testUser } from "../mock/fixture.loader";

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
            const compassManager = new CompassManager(dummy, dummy, requestDataController, dummy, dummy);
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
        const organizationMock: any = {name: "MockOrg", dbName: "mock-org", todoSentenceNumber: 5};

        const organizationDataController: any = {
            getOrganizationByDbName: sinon.stub().callsFake(() => organizationMock)
        };
        const groupDataController: any = {
            getUserGroups: sinon.stub().callsFake((orgId: string, userId: any) =>
                getScenarioOneGroups().filter((g: any) => g.users.indexOf(userId.toString()) !== -1)),
            getGroupsByIds: sinon.stub().callsFake((orgId: string, groupIds: string[]) =>
                getScenarioOneGroups().filter((g: any) => groupIds.indexOf(g._id) !== -1)),
            getGroups: sinon.stub().callsFake(() => getScenarioOneGroups())
        };
        const notificationManager: any = {
            sendNotificationById: sinon.stub().resolves()
        };
        let sandbox: any;

        beforeEach(() => sandbox = sinon.sandbox.create());
        afterEach(() => sandbox.restore());

        const aboutUserId = "5984342227cd340363dc84c7";
        const senderId = "5984342227cd340363dc84aa";
        const orgId = "hipteam";

        test("Adam should get Leadership and Communication questions about Eve", async () => {
            const aboutUserId = getScenarioOneUsers()[3]._id.toString(); // Eve;
            const ownerId = getScenarioOneUsers()[0]._id.toString(); // Adam

            sandbox.stub(CompassManager, "getAboutUser").callsFake((orgId: string, userId: string) => {
                if (userId == aboutUserId) return getScenarioOneUsers()[3];
                throw new Error("getAboutUser -> wrong user id");
            });
            sandbox.stub(CompassDataController, "getSkillsByIds").callsFake((orgId: string, ids: string[]) =>
                ids.map((id: string) => getScenarioOneSkills().find((skill: any) => id === skill._id)));
            sandbox.stub(UserDataController, "getOrganizationUsers").resolves(getScenarioOneUsers());
            sandbox.stub(CompassDataController, "saveCompassTodo").callsFake((orgId: string, todo: any) => todo);

            const compassManager = new CompassManager(groupDataController, organizationDataController, dummy, notificationManager, dummy);
            const result = await compassManager.answerCard(aboutUserId, ownerId, organizationMock.dbName);

            let containsLeadershipQuestion = false;
            for (const question of result.questions) {
                containsLeadershipQuestion = containsLeadershipQuestion || question.skill.name === "Leadership";
            }

            let containerCommunicationQuestion = false;
            for (const question of result.questions) {
                containerCommunicationQuestion = containerCommunicationQuestion || question.skill.name === "Communication";
            }

            expect(result).to.not.be.undefined;
            validateCompassTodo(result, 5, true);
            expect(containsLeadershipQuestion).to.be.true;
            expect(containerCommunicationQuestion).to.be.true;
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

            const compassManager = new CompassManager(groupDataController, organizationDataController, dummy, notificationManager, dummy);

            compassManager.answerCard(aboutUserId, senderId, orgId)
                .then(() => {
                    getSkillsByIds.restore();
                    generateTodo.restore();
                    done(new Error('This case answerCard should throw an error'));
                })
                .catch((error: any) => {
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
                compassGenerationTime: "* */10 * * * *"
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
        test("Should call UserDataController.getUserByIdFromOrg", async () => {
            let userDataControllerStub: Sinon.SinonStub = sinon.stub(UserDataController, "getUserByIdFromOrg").returns(Promise.resolve({}));
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

            const statisticsManager: any = {
                createOrUpdateStatistics: sinon.stub().withArgs(mockOrgId, savedAnswer).resolves(mockStatistics)
            };

            const saveOrUpdateStatistics = sinon.stub(StatisticsDataController, 'saveOrUpdateStatistics');
            saveOrUpdateStatistics
                .withArgs(mockOrgId, mockStatistics)
                .resolves(mockStatistics);

            const compassManager = new CompassManager(dummy, dummy, dummy, dummy, statisticsManager);
            const result = await compassManager.answerCompass(mockOrgId, mockAnswer);

            getTodoById.restore();
            updateCompassTodo.restore();
            saveCompassAnswer.restore();
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

        test.skip("Should collect user groups, get statistics, save and return", async () => {
            const mockSkill: any = {_id: "skillId", name: "Skill"};
            const mockStatistics: any = {
                user: testUser._id,
                skillScores: [mockSkill, mockSkill]
            };
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

            const statisticsManager: any = {
                getStatistics: sinon.stub().withArgs(orgId, userId, groups).resolves(mockStatistics)
            };

            const saveOrUpdateStatistics = sinon.stub(StatisticsDataController, 'saveOrUpdateStatistics');
            saveOrUpdateStatistics.resolves(mockStatistics);
            const getStatisticsByUserId = sinon.stub(StatisticsDataController, 'getStatisticsByUserId');
            getStatisticsByUserId.withArgs(orgId, userId).resolves(mockStatistics);

            const getSkillById = sinon.stub(CompassDataController, 'getSkillById');
            getSkillById.withArgs(orgId, userId).resolves(mockStatistics);

            const compassManager = new CompassManager(groupDataController, dummy, dummy, dummy, statisticsManager);
            const result = await compassManager.getStatistics(orgId, userId);

            saveOrUpdateStatistics.restore();
            getStatisticsByUserId.restore();
            getSkillById.restore();
            sinon.assert.calledWith(groupDataController.getUserGroups, orgId, userId);
            expect(result).to.be.deep.equal(mockStatistics);
        })
    });

    suite("filterStatistics", () => {
        const userSkillIds = [`5940f6044d0d550007d863d1`, `5940f6044d0d550007d863d2`];
        const statistics: any = {
            userId: "userId",
            skillScores: [
                createSkillScore(createSkill(1, createSentence(1), createSentence(2))),
                createSkillScore(createSkill(2, createSentence(3), createSentence(4))),
                createSkillScore(createSkill(3, createSentence(5), createSentence(6))),
                createSkillScore(createSkill(4, createSentence(7), createSentence(8)))
            ]
        };
        test("Should return only 2 skillScores", async () => {
            const compassManager = new CompassManager(dummy, dummy, dummy, dummy, dummy);
            const result = compassManager.filterStatistics(userSkillIds, statistics);

            expect(result.skillScores).to.have.lengthOf(2);
        });

        test("Skill scores array should contain skill 1 and 2", async () => {
            const compassManager = new CompassManager(dummy, dummy, dummy, dummy, dummy);
            const result = compassManager.filterStatistics(userSkillIds, statistics);

            let hasSkillOne = false;
            let hasSkillTwo = false;

            result.skillScores.forEach((sc: any) => {
                if (sc.skill === `5940f6044d0d550007d863d1`) hasSkillOne = true;
                if (sc.skill === `5940f6044d0d550007d863d2`) hasSkillTwo = true;
            });

            assert(hasSkillOne && hasSkillTwo);
        });

        test("Skill scores array should not container other skills", async () => {
            const compassManager = new CompassManager(dummy, dummy, dummy, dummy, dummy);
            const result = compassManager.filterStatistics(userSkillIds, statistics);

            let hasSkillThree = false;
            let hasSkillFour = false;

            result.skillScores.forEach((sc: any) => {
                if (sc.skill === `5940f6044d0d550007d863d3`) hasSkillThree = true;
                if (sc.skill === `5940f6044d0d550007d863d4`) hasSkillFour = true;
            });

            assert(!(hasSkillThree || hasSkillFour));
        })
    });

    suite("Auto Generate Todos For Organization", () => {
        const organizationMock: any = {name: "MockOrg", dbName: "mock-org", todoSentenceNumber: 5};
        const random = (array: any[]) => array[0 % array.length];
        const groupDataController: any = {
            getUserGroups: sinon.stub().callsFake((orgId: string, userId: any) =>
                getScenarioOneGroups().filter((g: any) => g.users.indexOf(userId.toString()) !== -1)),
            getGroupsByIds: sinon.stub().callsFake((orgId: string, groupIds: string[]) =>
                getScenarioOneGroups().filter((g: any) => groupIds.indexOf(g._id) !== -1)),
            getGroups: sinon.stub().callsFake(() => getScenarioOneGroups())
        };
        let sandbox: any;

        const notificationManager: any = {
            sendNotificationById: sinon.stub().resolves()
        };

        beforeEach(() => sandbox = sinon.sandbox.create());
        afterEach(() => sandbox.restore());

        test("Should generate an array with objects", async () => {
            sandbox.stub(CompassDataController, "getSkillsByIds").callsFake((orgId: string, ids: string[]) =>
                ids.map((id: string) => getScenarioOneSkills().find((skill: any) => id === skill._id)));
            sandbox.stub(UserDataController, "getOrganizationUsers").resolves(getScenarioOneUsers());
            sandbox.stub(CompassDataController, "saveCompassTodo").resolves();

            const compassManager: any = new CompassManager(groupDataController, dummy, dummy, notificationManager, dummy);

            const result = await compassManager.autoGenerateTodosForOrganization(organizationMock, random);
            expect(result).to.be.instanceOf(Array);
            expect(result.length).to.be.greaterThan(0);
        });

        test("Array should contain TODO objects", async () => {
            sandbox.stub(CompassDataController, "getSkillsByIds").callsFake((orgId: string, ids: string[]) =>
                ids.map((id: string) => getScenarioOneSkills().find((skill: any) => id === skill._id)));
            sandbox.stub(UserDataController, "getOrganizationUsers").resolves(getScenarioOneUsers());
            sandbox.stub(CompassDataController, "saveCompassTodo").resolves();

            const compassManager: any = new CompassManager(groupDataController, dummy, dummy, notificationManager, dummy);

            const result = await compassManager.autoGenerateTodosForOrganization(organizationMock, random);
            validateCompassTodo(result[0], organizationMock.todoSentenceNumber, true);
        });

        test("TODO owner and about must be different", async () => {
            sandbox.stub(CompassDataController, "getSkillsByIds").callsFake((orgId: string, ids: string[]) =>
                ids.map((id: string) => getScenarioOneSkills().find((skill: any) => id === skill._id)));
            sandbox.stub(UserDataController, "getOrganizationUsers").resolves(getScenarioOneUsers());
            sandbox.stub(CompassDataController, "saveCompassTodo").resolves();

            const compassManager: any = new CompassManager(groupDataController, dummy, dummy, notificationManager, dummy);

            for (let i = 0; i < 10; i++) {
                const result = await compassManager.autoGenerateTodosForOrganization(
                    organizationMock,
                    (array: any[]) => array[i % array.length]);
                result.forEach((todo: any) => {
                    if (todo.about.toString() === todo.owner.toString()) {
                        fail("Owner and about are the same: " + JSON.stringify(todo))
                    }
                });
            }
        });

        test("TODO about must not be empty", async () => {
            sandbox.stub(CompassDataController, "getSkillsByIds").callsFake((orgId: string, ids: string[]) =>
                ids.map((id: string) => getScenarioOneSkills().find((skill: any) => id === skill._id)));
            sandbox.stub(UserDataController, "getOrganizationUsers").resolves([getScenarioOneUsers()[5]]); // User Bono
            sandbox.stub(CompassDataController, "saveCompassTodo").resolves();

            const compassManager: any = new CompassManager(groupDataController, dummy, dummy, notificationManager, dummy);

            const result = await compassManager.autoGenerateTodosForOrganization(organizationMock, getRandomItem);
            result.forEach((todo: any) => {
                expect(todo.about).to.not.be.undefined;
                expect(todo.about).to.not.be.empty;
            });
        });

        test("Should be able to generate TODO about Eve for Adam", async () => {
            const random = (array: any[]) => array[0 % array.length];
            sandbox.stub(CompassDataController, "getSkillsByIds").callsFake((orgId: string, ids: string[]) =>
                ids.map((id: string) => getScenarioOneSkills().find((skill: any) => id === skill._id)));
            sandbox.stub(UserDataController, "getOrganizationUsers").resolves([getScenarioOneUsers()[0]]);
            sandbox.stub(CompassDataController, "saveCompassTodo").resolves();

            const compassManager: any = new CompassManager(groupDataController, dummy, dummy, notificationManager, dummy);

            const result = await compassManager.autoGenerateTodosForOrganization(organizationMock, random);
            expect(result[0].about).to.be.equal(getScenarioOneUsers()[3]._id.toString());
        });

        test("Adam should not get Database TODO question about Eve", async () => {
            const random = (array: any[]) => array[0 % array.length];
            sandbox.stub(CompassDataController, "getSkillsByIds").callsFake((orgId: string, ids: string[]) =>
                ids.map((id: string) => getScenarioOneSkills().find((skill: any) => id === skill._id)));
            sandbox.stub(UserDataController, "getOrganizationUsers").resolves([getScenarioOneUsers()[0]]);
            sandbox.stub(CompassDataController, "saveCompassTodo").resolves();

            const compassManager: any = new CompassManager(groupDataController, dummy, dummy, notificationManager, dummy);

            const result = await compassManager.autoGenerateTodosForOrganization(organizationMock, random);
            for (const question of result[0].questions) {
                expect(question.skill.name).not.to.be.equal("Databases");
            }
        });

        test("Adam should get Leadership TODO question about Eve", async () => {
            const random = (array: any[]) => array[0 % array.length];
            sandbox.stub(CompassDataController, "getSkillsByIds").callsFake((orgId: string, ids: string[]) =>
                ids.map((id: string) => getScenarioOneSkills().find((skill: any) => id === skill._id)));
            sandbox.stub(UserDataController, "getOrganizationUsers").resolves([getScenarioOneUsers()[0]]);
            sandbox.stub(CompassDataController, "saveCompassTodo").resolves();

            const compassManager: any = new CompassManager(groupDataController, dummy, dummy, notificationManager, dummy);

            const result = await compassManager.autoGenerateTodosForOrganization(organizationMock, random);
            let containsLeadershipQuestion = false;
            for (const question of result[0].questions) {
                containsLeadershipQuestion = containsLeadershipQuestion || question.skill.name === "Leadership";
            }
            expect(containsLeadershipQuestion).to.be.true;
        })
    });
});
