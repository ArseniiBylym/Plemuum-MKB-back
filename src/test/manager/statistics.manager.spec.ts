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
    createSkillScore
} from "../util/statistics.manager.util";

suite("Compass Statistics Manager tests", () => {

    suite("createOrUpdateStatistics", () => {
        const orgId = "orgId";
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
                    createSentenceAnswer(0, 1, ANSWER_TYPES.AGREE),
                    createSentenceAnswer(1, 3, ANSWER_TYPES.DISAGREE),
                    createSentenceAnswer(2, 5, ANSWER_TYPES.SKIP));

                // Expected output
                const expectedStatistics: any = {
                    user: "aboutUser",
                    skillScores: [
                        createSkillScore(0, createSentenceScore(1, 1, 0)),
                        createSkillScore(1, createSentenceScore(3, 0, 1)),
                    ]
                };

                const result = StatisticsManager.updateStatistics(answer, statistics);

                expect(result).to.be.deep.equal(expectedStatistics);
            });

            test("One skill multiple times", async () => {
                // Input
                const answer: any = createCompassAnswer(
                    //createSentenceAnswer(skill_number, sentence_number, answer)
                    createSentenceAnswer(0, 1, ANSWER_TYPES.AGREE),
                    createSentenceAnswer(0, 2, ANSWER_TYPES.AGREE),
                    createSentenceAnswer(2, 5, ANSWER_TYPES.SKIP));

                // Expected output
                const expectedStatistics: any = {
                    user: "aboutUser",
                    skillScores: [
                        createSkillScore(0, createSentenceScore(1, 1, 0), createSentenceScore(2, 1, 0)),
                    ]
                };

                const result = StatisticsManager.updateStatistics(answer, statistics);

                expect(result).to.be.deep.equal(expectedStatistics);
            });

            test("Just SKIP answers", async () => {
                // Input
                const answer: any = createCompassAnswer(
                    //createSentenceAnswer(skill_number, sentence_number, answer)
                    createSentenceAnswer(0, 1, ANSWER_TYPES.SKIP),
                    createSentenceAnswer(1, 3, ANSWER_TYPES.SKIP),
                    createSentenceAnswer(2, 5, ANSWER_TYPES.SKIP));

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
                        createSkillScore(0, createSentenceScore(1, 1, 0)),
                        createSkillScore(1, createSentenceScore(3, 0, 1)),
                    ]
                };
            });

            test("Three difference skills", async () => {
                // Input
                const answer: any = createCompassAnswer(
                    //createSentenceAnswer(skill_number, sentence_number, answer)
                    createSentenceAnswer(0, 1, ANSWER_TYPES.AGREE),
                    createSentenceAnswer(1, 3, ANSWER_TYPES.DISAGREE),
                    createSentenceAnswer(2, 5, ANSWER_TYPES.SKIP));

                // Expected output
                const expectedStatistics: any = {
                    user: "aboutUser",
                    skillScores: [
                        createSkillScore(0, createSentenceScore(1, 2, 0)),
                        createSkillScore(1, createSentenceScore(3, 0, 2))
                    ]
                };

                const result = StatisticsManager.updateStatistics(answer, statistics);

                expect(result).to.be.deep.equal(expectedStatistics);
            });

            test("One skill multiple times", async () => {
                // Input
                const answer: any = createCompassAnswer(
                    //createSentenceAnswer(skill_number, sentence_number, answer)
                    createSentenceAnswer(0, 1, ANSWER_TYPES.AGREE),
                    createSentenceAnswer(0, 2, ANSWER_TYPES.AGREE),
                    createSentenceAnswer(2, 5, ANSWER_TYPES.SKIP));

                // Expected output
                const expectedStatistics: any = {
                    user: "aboutUser",
                    skillScores: [
                        createSkillScore(0, createSentenceScore(1, 2, 0), createSentenceScore(2, 1, 0)),
                        createSkillScore(1, createSentenceScore(3, 0, 1))
                    ]
                };

                const result = StatisticsManager.updateStatistics(answer, statistics);

                expect(result).to.be.deep.equal(expectedStatistics);
            });

            test("Just SKIP answers", async () => {
                // Input
                const answer: any = createCompassAnswer(
                    //createSentenceAnswer(skill_number, sentence_number, answer)
                    createSentenceAnswer(0, 1, ANSWER_TYPES.SKIP),
                    createSentenceAnswer(1, 3, ANSWER_TYPES.SKIP),
                    createSentenceAnswer(2, 5, ANSWER_TYPES.SKIP));

                // Expected output
                const expectedStatistics: any = {
                    user: "aboutUser",
                    skillScores: [
                        createSkillScore(0, createSentenceScore(1, 1, 0)),
                        createSkillScore(1, createSentenceScore(3, 0, 1))
                    ]
                };

                const result = StatisticsManager.updateStatistics(answer, statistics);

                expect(result).to.be.deep.equal(expectedStatistics);
            })
        })
    })
});