import StatisticsManager from "../../api/manager/statistics.manager";
import * as sinon from 'sinon';
import StatisticsDataController from "../../data/datacontroller/statistics.datacontroller";
import CompassDataController from "../../data/datacontroller/compass.datacontroller";
import { expect } from 'chai';
import { ANSWER_TYPES } from "../../data/models/organization/compass/compassanswer.model";
import {
    createCompassAnswer,
    createSentenceAnswer,
    createSentenceScore,
    createSkillScore,
    skills
} from "../util/statistics.manager.util";
import Group from "../../data/models/organization/group.model";

suite("Compass Statistics Manager tests", () => {
    const orgId = "orgId";

    suite("saveOrUpdateStatistics", () => {
        const answer: any = sinon.mock();
        const todo: any = sinon.mock();
        const statistics: any = sinon.mock();
        answer.compassTodo = "123asd321";
        todo.about = "aboutUserId";

        test("Create a new statistics from answer", async () => {
            const createStatistics = sinon.stub(StatisticsManager, 'createStatistics').resolves(statistics);
            const getTodoById = sinon.stub(CompassDataController, 'getTodoById');
            getTodoById.withArgs(orgId, answer.compassTodo).resolves(todo);
            const getStatisticsByUserId = sinon.stub(StatisticsDataController, 'getStatisticsByUserId');

            const result = await StatisticsManager.createOrUpdateStatistics(orgId, answer);

            getTodoById.restore();
            getStatisticsByUserId.restore();
            createStatistics.restore();

            sinon.assert.calledWith(createStatistics, answer);
            expect(result).to.be.deep.equal(statistics);
        });

        test("Update existing statistics if one exists", async () => {

            const statistics: any = sinon.mock();
            const updatedStatistics: any = sinon.mock();

            const updateStatistics = sinon.stub(StatisticsManager, 'updateStatistics').resolves(updatedStatistics);
            const getTodoById = sinon.stub(CompassDataController, 'getTodoById');

            getTodoById.withArgs(orgId, answer.compassTodo).resolves(todo);
            const getStatisticsByUserId = sinon.stub(StatisticsDataController, 'getStatisticsByUserId');
            getStatisticsByUserId.withArgs(orgId, todo.about).resolves(statistics);

            const result = await StatisticsManager.createOrUpdateStatistics(orgId, answer);

            getTodoById.restore();
            updateStatistics.restore();
            getStatisticsByUserId.restore();

            sinon.assert.calledWith(updateStatistics, answer, statistics);
            expect(result).to.be.deep.equal(updatedStatistics);
        })
    });

    suite("createStatistics", () => {
        const orgId = "orgId";
        test("Create a statistics object and pass it to updateStatistics", async () => {
            const answer: any = sinon.mock();
            const todo: any = sinon.mock();
            todo.about = "aboutUserId";

            const expectedStatistics: any = {
                user: todo.about,
                skillScores: []
            };

            const updateStatistics = sinon.stub(StatisticsManager, 'updateStatistics').resolves();
            await StatisticsManager.createStatistics(answer, todo);

            updateStatistics.restore();
            sinon.assert.calledWith(updateStatistics, answer, expectedStatistics);
        });
    });

    suite("updateStatistics", () => {

        suite("Update an empty statistics object", () => {

            let statistics: any = {};

            beforeEach(() => {
                statistics = {
                    user: "aboutUser",
                    skillScores: []
                };
            });

            test("Three difference skills", async () => {
                // Input
                const answer: any = createCompassAnswer(
                    //createSentenceAnswer(skill_number, sentence_number, answer)
                    createSentenceAnswer(skills[0], 1, ANSWER_TYPES.AGREE),
                    createSentenceAnswer(skills[1], 3, ANSWER_TYPES.DISAGREE),
                    createSentenceAnswer(skills[2], 5, ANSWER_TYPES.SKIP));

                // Expected output
                const expectedStatistics: any = {
                    user: "aboutUser",
                    skillScores: [
                        createSkillScore(skills[0], false, createSentenceScore(1, 1, 0)),
                        createSkillScore(skills[1], false, createSentenceScore(3, 0, 1)),
                    ]
                };

                const result = StatisticsManager.updateStatistics(answer, statistics);

                expect(result).to.be.deep.equal(expectedStatistics);
            });

            test("One skill multiple times", async () => {
                // Input
                const answer: any = createCompassAnswer(
                    //createSentenceAnswer(skill_number, sentence_number, answer)
                    createSentenceAnswer(skills[0], 1, ANSWER_TYPES.AGREE),
                    createSentenceAnswer(skills[0], 2, ANSWER_TYPES.AGREE),
                    createSentenceAnswer(skills[2], 5, ANSWER_TYPES.SKIP));

                // Expected output
                const expectedStatistics: any = {
                    user: "aboutUser",
                    skillScores: [
                        createSkillScore(skills[0], false, createSentenceScore(1, 1, 0), createSentenceScore(2, 1, 0)),
                    ]
                };

                const result = StatisticsManager.updateStatistics(answer, statistics);

                expect(result).to.be.deep.equal(expectedStatistics);
            });

            test("Just SKIP answers", async () => {
                // Input
                const answer: any = createCompassAnswer(
                    //createSentenceAnswer(skill_number, sentence_number, answer)
                    createSentenceAnswer(skills[0], 1, ANSWER_TYPES.SKIP),
                    createSentenceAnswer(skills[1], 3, ANSWER_TYPES.SKIP),
                    createSentenceAnswer(skills[2], 5, ANSWER_TYPES.SKIP));

                // Expected output
                const expectedStatistics: any = {
                    user: "aboutUser",
                    skillScores: []
                };

                const result = StatisticsManager.updateStatistics(answer, statistics);

                expect(result).to.be.deep.equal(expectedStatistics);
            })
        });

        suite("Update existing statistics object", () => {
            let statistics: any = {};

            beforeEach(() => {
                statistics = {
                    user: "aboutUser",
                    skillScores: [
                        createSkillScore(skills[0], true, createSentenceScore(1, 1, 0)),
                        createSkillScore(skills[1], true, createSentenceScore(3, 0, 1)),
                    ]
                };
            });

            test("Three difference skills", async () => {
                // Input
                const answer: any = createCompassAnswer(
                    //createSentenceAnswer(skill_number, sentence_number, answer)
                    createSentenceAnswer(skills[0], 1, ANSWER_TYPES.AGREE),
                    createSentenceAnswer(skills[1], 3, ANSWER_TYPES.DISAGREE),
                    createSentenceAnswer(skills[2], 5, ANSWER_TYPES.SKIP));

                // Expected output
                const expectedStatistics: any = {
                    user: "aboutUser",
                    skillScores: [
                        createSkillScore(skills[0], true, createSentenceScore(1, 2, 0)),
                        createSkillScore(skills[1], true, createSentenceScore(3, 0, 2))
                    ]
                };

                const result = StatisticsManager.updateStatistics(answer, statistics);

                expect(result).to.be.deep.equal(expectedStatistics);
            });

            test("One skill multiple times", async () => {
                // Input
                const answer: any = createCompassAnswer(
                    //createSentenceAnswer(skill_number, sentence_number, answer)
                    createSentenceAnswer(skills[0], 1, ANSWER_TYPES.AGREE),
                    createSentenceAnswer(skills[0], 2, ANSWER_TYPES.AGREE),
                    createSentenceAnswer(skills[2], 5, ANSWER_TYPES.SKIP));

                // Expected output
                const expectedStatistics: any = {
                    user: "aboutUser",
                    skillScores: [
                        createSkillScore(skills[0], true, createSentenceScore(1, 2, 0), createSentenceScore(2, 1, 0)),
                        createSkillScore(skills[1], true, createSentenceScore(3, 0, 1))
                    ]
                };

                const result = StatisticsManager.updateStatistics(answer, statistics);

                expect(result).to.be.deep.equal(expectedStatistics);
            });

            test("Just SKIP answers", async () => {
                // Input
                const answer: any = createCompassAnswer(
                    //createSentenceAnswer(skill_number, sentence_number, answer)
                    createSentenceAnswer(skills[0], 1, ANSWER_TYPES.SKIP),
                    createSentenceAnswer(skills[1], 3, ANSWER_TYPES.SKIP),
                    createSentenceAnswer(skills[2], 5, ANSWER_TYPES.SKIP));

                // Expected output
                const expectedStatistics: any = {
                    user: "aboutUser",
                    skillScores: [
                        createSkillScore(skills[0], true, createSentenceScore(1, 1, 0)),
                        createSkillScore(skills[1], true, createSentenceScore(3, 0, 1))
                    ]
                };

                const result = StatisticsManager.updateStatistics(answer, statistics);

                expect(result).to.be.deep.equal(expectedStatistics);
            })
        })
    });

    suite("getStatistics", () => {
        const userId: any = "userId";

        test("No statistics in the DB yet, user has skills already", async () => {
            const groupUsers: any[] = [sinon.mock()];
            const groups: Group[] = [
                {
                    name: "Group name",
                    users: groupUsers,
                    answerCardRelations: [],
                    todoCardRelations: [],
                    skills: [skills[0]._id, skills[2]._id]
                },
                {
                    name: "Group name 2",
                    users: groupUsers,
                    answerCardRelations: [],
                    todoCardRelations: [],
                    skills: [skills[1]._id]
                }
            ];
            const getStatisticsByUserId = sinon.stub(StatisticsDataController, 'getStatisticsByUserId');

            const getSkillsByIds = sinon.stub(CompassDataController, 'getSkillsByIds');
            getSkillsByIds
                .withArgs(orgId, [skills[0]._id, skills[2]._id, skills[1]._id])
                .resolves([skills[0], skills[2], skills[1]]);

            // Expected output
            const expectedStatistics: any = {
                user: userId,
                skillScores: [
                    createSkillScore(skills[0], false),
                    createSkillScore(skills[2], false),
                    createSkillScore(skills[1], false)
                ]
            };

            const result = await StatisticsManager.getStatistics(orgId, userId, groups);

            getStatisticsByUserId.restore();
            getSkillsByIds.restore();

            expect(result).to.deep.equal(expectedStatistics);
        });

        test("Statistics in DB, but with all the user skills", async () => {
            const groupUsers: any[] = [sinon.mock()];
            const groups: Group[] = [
                {
                    name: "Group name",
                    users: groupUsers,
                    answerCardRelations: [],
                    todoCardRelations: [],
                    skills: [skills[0]._id]
                }
            ];

            // Expected output
            const expectedStatistics: any = {
                user: userId,
                skillScores: [
                    createSkillScore(skills[0], false, createSentenceScore(1, 3, 2), createSentenceScore(2, 0, 5)),
                ]
            };

            const getStatisticsByUserId = sinon.stub(StatisticsDataController, 'getStatisticsByUserId');
            getStatisticsByUserId.withArgs(orgId, userId).resolves(expectedStatistics);

            const getSkillsByIds = sinon.stub(CompassDataController, 'getSkillsByIds');
            getSkillsByIds
                .withArgs(orgId, [skills[0]._id])
                .resolves([skills[0]]);

            const result = await StatisticsManager.getStatistics(orgId, userId, groups);
            getStatisticsByUserId.restore();
            getSkillsByIds.restore();

            expect(result).to.deep.equal(expectedStatistics);
        });

        test("Statistics in DB, and the user has more skills", async () => {
            const groupUsers: any[] = [sinon.mock()];
            const groups: Group[] = [
                {
                    name: "Group name",
                    users: groupUsers,
                    answerCardRelations: [],
                    todoCardRelations: [],
                    skills: [skills[0]._id, skills[1]._id, skills[2]._id]
                }
            ];

            // Expected output
            const dbStatistics: any = {
                user: userId,
                skillScores: [
                    createSkillScore(skills[0], false, createSentenceScore(1, 3, 2), createSentenceScore(2, 0, 5)),
                ]
            };

            const getStatisticsByUserId = sinon.stub(StatisticsDataController, 'getStatisticsByUserId');
            getStatisticsByUserId.withArgs(orgId, userId).resolves(dbStatistics);

            const getSkillsByIds = sinon.stub(CompassDataController, 'getSkillsByIds');
            getSkillsByIds
                .withArgs(orgId, [skills[0]._id, skills[1]._id, skills[2]._id])
                .resolves([skills[0], skills[1], skills[2]]);

            const result = await StatisticsManager.getStatistics(orgId, userId, groups);
            getStatisticsByUserId.restore();
            getSkillsByIds.restore();

            // Expected output
            const expectedStatistics: any = {
                user: userId,
                skillScores: [
                    createSkillScore(skills[0], false, createSentenceScore(1, 3, 2), createSentenceScore(2, 0, 5)),
                    createSkillScore(skills[1], false),
                    createSkillScore(skills[2], false),
                ]
            };

            expect(result).to.deep.equal(expectedStatistics);
        });

        test("Statistics in DB, and the user lost skills", async () => {
            const groupUsers: any[] = [sinon.mock()];
            const groups: Group[] = [
                {
                    name: "Group name",
                    users: groupUsers,
                    answerCardRelations: [],
                    todoCardRelations: [],
                    skills: [skills[0]._id,]
                }
            ];

            // Expected output
            const dbStatistics: any = {
                user: userId,
                skillScores: [
                    createSkillScore(skills[0], false, createSentenceScore(1, 3, 2), createSentenceScore(2, 0, 5)),
                    createSkillScore(skills[1], false, createSentenceScore(2, 10, 2), createSentenceScore(3, 3, 0)),
                    createSkillScore(skills[2], false, createSentenceScore(3, 0, 15)),
                ]
            };

            const getStatisticsByUserId = sinon.stub(StatisticsDataController, 'getStatisticsByUserId');
            getStatisticsByUserId.withArgs(orgId, userId).resolves(dbStatistics);

            const getSkillsByIds = sinon.stub(CompassDataController, 'getSkillsByIds');
            getSkillsByIds
                .withArgs(orgId, [skills[0]._id])
                .resolves([skills[0]]);

            const result = await StatisticsManager.getStatistics(orgId, userId, groups);
            getStatisticsByUserId.restore();
            getSkillsByIds.restore();

            // Expected output
            const expectedStatistics: any = {
                user: userId,
                skillScores: [
                    createSkillScore(skills[0], false, createSentenceScore(1, 3, 2), createSentenceScore(2, 0, 5)),
                    createSkillScore(skills[1], false, createSentenceScore(2, 10, 2), createSentenceScore(3, 3, 0)),
                    createSkillScore(skills[2], false, createSentenceScore(3, 0, 15)),
                ]
            };

            expect(result).to.deep.equal(expectedStatistics);
        })
    })
});