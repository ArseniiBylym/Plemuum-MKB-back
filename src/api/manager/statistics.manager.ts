import CompassAnswer from "../../data/models/organization/compass/compassanswer.model";
import StatisticsDataController from "../../data/datacontroller/statistics.datacontroller";
import {
    CompassStatistics,
    SentenceScore,
    SkillScore
} from "../../data/models/organization/compass/compass.statistics.model";
import CompassDataController from "../../data/datacontroller/compass.datacontroller";
import CompassTodo from "../../data/models/organization/compass/compasstodo.model";

enum ANSWER_TYPES {
    AGREE = "AGREE",
    DISAGREE = "DISAGREE",
    SKIP = "SKIP",
}

export default class StatisticsManager {

    static async createOrUpdateStatistics(orgId: string, answer: CompassAnswer) {
        const todo: CompassTodo = await CompassDataController.getTodoById(orgId, answer.compassTodo);
        const statistics = await StatisticsDataController.getStatisticsByUserId(orgId, todo.about);
        if (statistics) {
            this.updateStatistics(orgId, answer, statistics);
        } else {
            this.createStatistics(orgId, answer, todo);
        }
    }

    static createStatistics(orgId: string, answer: CompassAnswer, todo: CompassTodo) {
        const statistics: CompassStatistics = {
            user: todo.about,
            skillScores: []
        };
        return this.updateStatistics(orgId, answer, statistics);
    }

    static updateStatistics(orgId: string, answer: CompassAnswer, statistics: CompassStatistics) {
        const validSentenceAnswers = answer.sentencesAnswer.filter((sentenceAnswer: any) => sentenceAnswer.answer !== ANSWER_TYPES.SKIP);
        validSentenceAnswers.forEach((sentenceAnswer: any) => {
            let skillScore = statistics.skillScores.find((element) => element.skill === sentenceAnswer.skill._id);
            if (skillScore) {
                this.createOrUpdateSentenceScore(skillScore, sentenceAnswer);
            } else {
                skillScore = this.createSkillScoreFromAnswer(sentenceAnswer);
                statistics.skillScores.push(skillScore);
            }
        });
        return statistics;
    }

    private static createOrUpdateSentenceScore(skillScore: SkillScore, sentenceAnswer: any) {
        let sentenceScore = skillScore.sentenceScores.find((ss) => ss.sentence === sentenceAnswer.sentence._id);
        if (sentenceScore) {
            this.updateSentence(sentenceAnswer, sentenceScore);
        } else {
            sentenceScore = this.createSentenceScoreFromAnswer(sentenceAnswer);
            skillScore.sentenceScores.push(sentenceScore);
        }
    }

    private static updateSentence(sentenceAnswer: any, sentenceScore: SentenceScore) {
        if (sentenceAnswer.answer === ANSWER_TYPES.AGREE) {
            sentenceScore.numberOfAgree++;
        } else if (sentenceAnswer.answer === ANSWER_TYPES.DISAGREE) {
            sentenceScore.numberOfDisagree++;
        }
    }

    private static createSentenceScoreFromAnswer(sentenceAnswer: any) {
        return {
            sentence: sentenceAnswer.sentence._id,
            numberOfAgree: sentenceAnswer.answer === "AGREE" ? 1 : 0,
            numberOfDisagree: sentenceAnswer.answer === "DISAGREE" ? 1 : 0
        };
    }

    private static createSkillScoreFromAnswer(sentenceAnswer: any): SkillScore {
        return {
            skill: sentenceAnswer.skill._id,
            sentenceScores: [this.createSentenceScoreFromAnswer(sentenceAnswer)]
        }
    }
}