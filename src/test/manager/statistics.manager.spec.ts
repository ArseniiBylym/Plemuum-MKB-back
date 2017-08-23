import StatisticsManager from "../../api/manager/statistics.manager";
import * as sinon from 'sinon';
import StatisticsDataController from "../../data/datacontroller/statistics.datacontroller";
import CompassDataController from "../../data/datacontroller/compass.datacontroller";
import { expect } from 'chai';

suite("Compass Statistics Manager tests", () => {

    suite("createOrUpdateStatistics", () => {
        const orgId = "orgId";
        const answer: any = sinon.mock();
        answer.compassTodo = "123asd321";
        const todo: any = sinon.mock();
        todo.about = "aboutUserId";

        test("Create a new statistics from answer", async () => {
            const createStatistics = sinon.stub(StatisticsManager, 'createStatistics');
            const getTodoById = sinon.stub(CompassDataController, 'getTodoById');
            getTodoById.withArgs(orgId, answer.compassTodo).resolves(todo);
            const getStatisticsByUserId = sinon.stub(StatisticsDataController, 'getStatisticsByUserId');

            const result = await StatisticsManager.createOrUpdateStatistics(orgId, answer);

            getTodoById.restore();
            getStatisticsByUserId.restore();
            createStatistics.restore();

            sinon.assert.calledWith(createStatistics, orgId, answer);
        });

        test("Update existing statistics if one exists", async () => {

            const statistics: any = sinon.mock();

            const updateStatistics = sinon.stub(StatisticsManager, 'updateStatistics');
            const getTodoById = sinon.stub(CompassDataController, 'getTodoById');

            getTodoById.withArgs(orgId, answer.compassTodo).resolves(todo);
            const getStatisticsByUserId = sinon.stub(StatisticsDataController, 'getStatisticsByUserId');
            getStatisticsByUserId.withArgs(orgId, todo.about).resolves(statistics);

            const result = await StatisticsManager.createOrUpdateStatistics(orgId, answer);

            getTodoById.restore();
            updateStatistics.restore();
            getStatisticsByUserId.restore();

            sinon.assert.calledWith(updateStatistics, orgId, answer, statistics);
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
            const result = await StatisticsManager.createStatistics(orgId, answer, todo);

            updateStatistics.restore();
            sinon.assert.calledWith(updateStatistics, orgId, answer, expectedStatistics);
        });
    });

    suite("updateStatistics", () => {
        const orgId = "orgId";

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
                const answer: any = {
                    compassTodo: "compassTodo",
                    sender: "sender",
                    sentencesAnswer: [
                        {
                            skill: {
                                _id: "skillId",
                                name: "skill name",
                                sentences: [
                                    {
                                        _id: "sentenceId1",
                                        message: "sentence1"
                                    },
                                    {
                                        _id: "sentenceId2",
                                        message: "sentence2"
                                    }
                                ],
                                inactiveSentences: []
                            },
                            sentence: {
                                _id: "sentenceId1",
                                message: "sentence1"
                            },
                            answer: "AGREE"
                        },
                        {
                            skill: {
                                _id: "skillId2",
                                name: "skill name",
                                sentences: [
                                    {
                                        _id: "sentenceId3",
                                        message: "sentence3"
                                    }
                                ],
                                inactiveSentences: []
                            },
                            sentence: {
                                _id: "sentenceId3",
                                message: "sentence3"
                            },
                            answer: "DISAGREE"
                        },
                        {
                            skill: {
                                _id: "skillId3",
                                name: "skill name3",
                                sentences: [
                                    {
                                        _id: "sentenceId4",
                                        message: "sentence4"
                                    },
                                    {
                                        _id: "sentenceId5",
                                        message: "sentence5"
                                    }
                                ],
                                inactiveSentences: []
                            },
                            sentence: {
                                _id: "sentenceId5",
                                message: "sentence5"
                            },
                            answer: "SKIP"
                        }
                    ]
                };
                // Expected output
                const expectedStatistics: any = {
                    user: "aboutUser",
                    skillScores: [
                        {
                            skill: "skillId",
                            sentenceScores: [
                                {
                                    sentence: "sentenceId1",
                                    numberOfAgree: 1,
                                    numberOfDisagree: 0
                                }
                            ]
                        },
                        {
                            skill: "skillId2",
                            sentenceScores: [
                                {
                                    sentence: "sentenceId3",
                                    numberOfAgree: 0,
                                    numberOfDisagree: 1
                                }
                            ]
                        }
                    ]
                };

                const result = StatisticsManager.updateStatistics(orgId, answer, statistics);

                expect(result).to.be.deep.equal(expectedStatistics);

            });

            test("One skill multiple times", async () => {
                // Input
                const answer: any = {
                    compassTodo: "compassTodo",
                    sender: "sender",
                    sentencesAnswer: [
                        {
                            skill: {
                                _id: "skillId",
                                name: "skill name",
                                sentences: [
                                    {
                                        _id: "sentenceId1",
                                        message: "sentence1"
                                    },
                                    {
                                        _id: "sentenceId2",
                                        message: "sentence2"
                                    }
                                ],
                                inactiveSentences: []
                            },
                            sentence: {
                                _id: "sentenceId1",
                                message: "sentence1"
                            },
                            answer: "AGREE"
                        },
                        {
                            skill: {
                                _id: "skillId",
                                name: "skill name",
                                sentences: [
                                    {
                                        _id: "sentenceId1",
                                        message: "sentence1"
                                    },
                                    {
                                        _id: "sentenceId2",
                                        message: "sentence2"
                                    }
                                ],
                                inactiveSentences: []
                            },
                            sentence: {
                                _id: "sentenceId2",
                                message: "sentence2"
                            },
                            answer: "AGREE"
                        },
                        {
                            skill: {
                                _id: "skillId3",
                                name: "skill name3",
                                sentences: [
                                    {
                                        _id: "sentenceId4",
                                        message: "sentence4"
                                    },
                                    {
                                        _id: "sentenceId5",
                                        message: "sentence5"
                                    }
                                ],
                                inactiveSentences: []
                            },
                            sentence: {
                                _id: "sentenceId5",
                                message: "sentence5"
                            },
                            answer: "SKIP"
                        }
                    ]
                };
                // Expected output
                const expectedStatistics: any = {
                    user: "aboutUser",
                    skillScores: [
                        {
                            skill: "skillId",
                            sentenceScores: [
                                {
                                    sentence: "sentenceId1",
                                    numberOfAgree: 1,
                                    numberOfDisagree: 0
                                },
                                {
                                    sentence: "sentenceId2",
                                    numberOfAgree: 1,
                                    numberOfDisagree: 0
                                }
                            ]
                        },
                    ]
                };

                const result = StatisticsManager.updateStatistics(orgId, answer, statistics);

                expect(result).to.be.deep.equal(expectedStatistics);

            });

            test("Just SKIP answers", async () => {
                // Input
                const answer: any = {
                    compassTodo: "compassTodo",
                    sender: "sender",
                    sentencesAnswer: [
                        {
                            skill: {
                                _id: "skillId",
                                name: "skill name",
                                sentences: [
                                    {
                                        _id: "sentenceId1",
                                        message: "sentence1"
                                    },
                                    {
                                        _id: "sentenceId2",
                                        message: "sentence2"
                                    }
                                ],
                                inactiveSentences: []
                            },
                            sentence: {
                                _id: "sentenceId1",
                                message: "sentence1"
                            },
                            answer: "SKIP"
                        },
                        {
                            skill: {
                                _id: "skillId2",
                                name: "skill name",
                                sentences: [
                                    {
                                        _id: "sentenceId3",
                                        message: "sentence3"
                                    },
                                ],
                                inactiveSentences: []
                            },
                            sentence: {
                                _id: "sentenceId3",
                                message: "sentence3"
                            },
                            answer: "SKIP"
                        },
                        {
                            skill: {
                                _id: "skillId3",
                                name: "skill name3",
                                sentences: [
                                    {
                                        _id: "sentenceId4",
                                        message: "sentence4"
                                    },
                                    {
                                        _id: "sentenceId5",
                                        message: "sentence5"
                                    }
                                ],
                                inactiveSentences: []
                            },
                            sentence: {
                                _id: "sentenceId5",
                                message: "sentence5"
                            },
                            answer: "SKIP"
                        }
                    ]
                };
                // Expected output
                const expectedStatistics: any = {
                    user: "aboutUser",
                    skillScores: []
                };

                const result = StatisticsManager.updateStatistics(orgId, answer, statistics);

                expect(result).to.be.deep.equal(expectedStatistics);

            })
        });

        suite("Update existing statistics object", () => {
            let statistics: any = {};

            beforeEach(() => {
                statistics = {
                    user: "aboutUser",
                    skillScores: [
                        {
                            skill: "skillId",
                            sentenceScores: [
                                {
                                    sentence: "sentenceId1",
                                    numberOfAgree: 1,
                                    numberOfDisagree: 0
                                }
                            ]
                        },
                        {
                            skill: "skillId2",
                            sentenceScores: [
                                {
                                    sentence: "sentenceId3",
                                    numberOfAgree: 0,
                                    numberOfDisagree: 1
                                }
                            ]
                        }
                    ]
                };
            });

            test("Three difference skills", async () => {
                // Input
                const answer: any = {
                    compassTodo: "compassTodo",
                    sender: "sender",
                    sentencesAnswer: [
                        {
                            skill: {
                                _id: "skillId",
                                name: "skill name",
                                sentences: [
                                    {
                                        _id: "sentenceId1",
                                        message: "sentence1"
                                    },
                                    {
                                        _id: "sentenceId2",
                                        message: "sentence2"
                                    }
                                ],
                                inactiveSentences: []
                            },
                            sentence: {
                                _id: "sentenceId1",
                                message: "sentence1"
                            },
                            answer: "AGREE"
                        },
                        {
                            skill: {
                                _id: "skillId2",
                                name: "skill name",
                                sentences: [
                                    {
                                        _id: "sentenceId3",
                                        message: "sentence3"
                                    }
                                ],
                                inactiveSentences: []
                            },
                            sentence: {
                                _id: "sentenceId3",
                                message: "sentence3"
                            },
                            answer: "DISAGREE"
                        },
                        {
                            skill: {
                                _id: "skillId3",
                                name: "skill name3",
                                sentences: [
                                    {
                                        _id: "sentenceId4",
                                        message: "sentence4"
                                    },
                                    {
                                        _id: "sentenceId5",
                                        message: "sentence5"
                                    }
                                ],
                                inactiveSentences: []
                            },
                            sentence: {
                                _id: "sentenceId5",
                                message: "sentence5"
                            },
                            answer: "SKIP"
                        }
                    ]
                };
                // Expected output
                const expectedStatistics: any = {
                    user: "aboutUser",
                    skillScores: [
                        {
                            skill: "skillId",
                            sentenceScores: [
                                {
                                    sentence: "sentenceId1",
                                    numberOfAgree: 2,
                                    numberOfDisagree: 0
                                }
                            ]
                        },
                        {
                            skill: "skillId2",
                            sentenceScores: [
                                {
                                    sentence: "sentenceId3",
                                    numberOfAgree: 0,
                                    numberOfDisagree: 2
                                }
                            ]
                        }
                    ]
                };

                const result = StatisticsManager.updateStatistics(orgId, answer, statistics);

                expect(result).to.be.deep.equal(expectedStatistics);

            });

            test("One skill multiple times", async () => {
                // Input
                const answer: any = {
                    compassTodo: "compassTodo",
                    sender: "sender",
                    sentencesAnswer: [
                        {
                            skill: {
                                _id: "skillId",
                                name: "skill name",
                                sentences: [
                                    {
                                        _id: "sentenceId1",
                                        message: "sentence1"
                                    },
                                    {
                                        _id: "sentenceId2",
                                        message: "sentence2"
                                    }
                                ],
                                inactiveSentences: []
                            },
                            sentence: {
                                _id: "sentenceId1",
                                message: "sentence1"
                            },
                            answer: "AGREE"
                        },
                        {
                            skill: {
                                _id: "skillId",
                                name: "skill name",
                                sentences: [
                                    {
                                        _id: "sentenceId1",
                                        message: "sentence1"
                                    },
                                    {
                                        _id: "sentenceId2",
                                        message: "sentence2"
                                    }
                                ],
                                inactiveSentences: []
                            },
                            sentence: {
                                _id: "sentenceId2",
                                message: "sentence2"
                            },
                            answer: "AGREE"
                        },
                        {
                            skill: {
                                _id: "skillId3",
                                name: "skill name3",
                                sentences: [
                                    {
                                        _id: "sentenceId4",
                                        message: "sentence4"
                                    },
                                    {
                                        _id: "sentenceId5",
                                        message: "sentence5"
                                    }
                                ],
                                inactiveSentences: []
                            },
                            sentence: {
                                _id: "sentenceId5",
                                message: "sentence5"
                            },
                            answer: "SKIP"
                        }
                    ]
                };
                // Expected output
                const expectedStatistics: any = {
                    user: "aboutUser",
                    skillScores: [
                        {
                            skill: "skillId",
                            sentenceScores: [
                                {
                                    sentence: "sentenceId1",
                                    numberOfAgree: 2,
                                    numberOfDisagree: 0
                                },
                                {
                                    sentence: "sentenceId2",
                                    numberOfAgree: 1,
                                    numberOfDisagree: 0
                                }
                            ]
                        },
                        {
                            skill: "skillId2",
                            sentenceScores: [
                                {
                                    sentence: "sentenceId3",
                                    numberOfAgree: 0,
                                    numberOfDisagree: 1
                                }
                            ]
                        }
                    ]
                };

                const result = StatisticsManager.updateStatistics(orgId, answer, statistics);

                expect(result).to.be.deep.equal(expectedStatistics);

            });

            test("Just SKIP answers", async () => {
                // Input
                const answer: any = {
                    compassTodo: "compassTodo",
                    sender: "sender",
                    sentencesAnswer: [
                        {
                            skill: {
                                _id: "skillId",
                                name: "skill name",
                                sentences: [
                                    {
                                        _id: "sentenceId1",
                                        message: "sentence1"
                                    },
                                    {
                                        _id: "sentenceId2",
                                        message: "sentence2"
                                    }
                                ],
                                inactiveSentences: []
                            },
                            sentence: {
                                _id: "sentenceId1",
                                message: "sentence1"
                            },
                            answer: "SKIP"
                        },
                        {
                            skill: {
                                _id: "skillId2",
                                name: "skill name",
                                sentences: [
                                    {
                                        _id: "sentenceId3",
                                        message: "sentence3"
                                    },
                                ],
                                inactiveSentences: []
                            },
                            sentence: {
                                _id: "sentenceId3",
                                message: "sentence3"
                            },
                            answer: "SKIP"
                        },
                        {
                            skill: {
                                _id: "skillId3",
                                name: "skill name3",
                                sentences: [
                                    {
                                        _id: "sentenceId4",
                                        message: "sentence4"
                                    },
                                    {
                                        _id: "sentenceId5",
                                        message: "sentence5"
                                    }
                                ],
                                inactiveSentences: []
                            },
                            sentence: {
                                _id: "sentenceId5",
                                message: "sentence5"
                            },
                            answer: "SKIP"
                        }
                    ]
                };
                // Expected output
                const expectedStatistics: any = {
                    user: "aboutUser",
                    skillScores: [
                        {
                            skill: "skillId",
                            sentenceScores: [
                                {
                                    sentence: "sentenceId1",
                                    numberOfAgree: 1,
                                    numberOfDisagree: 0
                                }
                            ]
                        },
                        {
                            skill: "skillId2",
                            sentenceScores: [
                                {
                                    sentence: "sentenceId3",
                                    numberOfAgree: 0,
                                    numberOfDisagree: 1
                                }
                            ]
                        }
                    ]
                };

                const result = StatisticsManager.updateStatistics(orgId, answer, statistics);

                expect(result).to.be.deep.equal(expectedStatistics);

            })
        })
    })
});