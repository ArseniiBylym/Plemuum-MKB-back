import CompassAnswer, { ANSWER_TYPES } from "../../data/models/organization/compass/compassanswer.model";
import StatisticsDataController from "../../data/datacontroller/statistics.datacontroller";
import { CompassStatistics, SkillScore } from "../../data/models/organization/compass/compass.statistics.model";
import CompassDataController from "../../data/datacontroller/compass.datacontroller";
import CompassTodo from "../../data/models/organization/compass/compasstodo.model";
import Group from "../../data/models/organization/group.model";

export default class StatisticsManager {

    /**
     * Entrance point. Creates and/or updates Compass Statistics object
     *
     * @param {string} orgId Organization ID
     * @param {CompassAnswer} answer Compass Answer to put generate statistics about
     * @returns {Promise<any>} Return the generated or updated statistics
     */
    static async createOrUpdateStatistics(orgId: string, answer: CompassAnswer): Promise<any> {
        const todo: CompassTodo = await CompassDataController.getTodoById(orgId, answer.compassTodo);
        const statistics = await StatisticsDataController.getStatisticsByUserId(orgId, todo.about);
        return statistics
            ? this.updateStatistics(answer, statistics)
            : this.createStatistics(answer, todo);
    }

    /**
     * Return the user Compass Statistics. If there's no available statistics, then it'll initialize one.
     *
     * @param {string} orgId    Organization ID
     * @param {string} userId   User ID
     * @param {Group[]} groups  Groups the user participates in
     * @returns {Promise<CompassStatistics>}
     */
    static async getStatistics(orgId: string, userId: string, groups: Group[]): Promise<CompassStatistics> {
        const emptySkillScore = (skillId: string) => ({skill: skillId, sentenceScores: []});

        let availableSkillIds: string[] = [];
        groups.forEach((group) => availableSkillIds = availableSkillIds.concat(group.skills));

        const statistics = await StatisticsDataController.getStatisticsByUserId(orgId, userId);
        if (statistics) {
            const missingSkills: string[] = [];
            availableSkillIds.forEach((skillId) => {
                if (!statistics.skillScores.find((skillScore) => skillScore.skill === skillId)) {
                    missingSkills.push(skillId)
                }
            });
            if (missingSkills.length > 0) {
                missingSkills.forEach((skillId) => statistics.skillScores.push(emptySkillScore(skillId)));
            }
            return statistics;
        } else {
            const skillScores: SkillScore[] = [];
            availableSkillIds.forEach((skillId) => skillScores.push(emptySkillScore(skillId)));
            return {
                user: userId,
                skillScores: skillScores
            }
        }
    }

    // Creates an empty statistics object and calls update to fill it up
    static createStatistics(answer: CompassAnswer, todo: CompassTodo) {
        return this.updateStatistics(answer, {user: todo.about, skillScores: []});
    }

    static updateStatistics(answer: CompassAnswer, statistics: CompassStatistics) {
        // Filter SKIP answers, since we don't want to count them
        const validSentenceAnswers = answer.sentencesAnswer.filter(
            (sentenceAnswer: any) => sentenceAnswer.answer !== ANSWER_TYPES.SKIP);
        validSentenceAnswers.forEach((sentenceAnswer: any) => {
            // Check if there's a skill score for that skill
            let skillScore = statistics.skillScores.find((element) => element.skill === sentenceAnswer.skill._id);
            if (skillScore) {
                // If there's already a skill score for that skill, create or update a sentence score
                this.createOrUpdateSentenceScore(skillScore, sentenceAnswer);
            } else {
                // If there's no skill score for that skill, create a new one with one sentence score and push
                // into the array
                skillScore = this.createSkillScore(sentenceAnswer);
                statistics.skillScores.push(skillScore);
            }
        });
        return statistics;
    }

    private static createOrUpdateSentenceScore(skillScore: SkillScore, sentenceAnswer: any) {
        let sentenceScore = skillScore.sentenceScores.find((ss: any) => ss.sentence._id === sentenceAnswer.sentence._id);
        if (sentenceScore) {
            if (sentenceAnswer.answer === ANSWER_TYPES.AGREE) {
                sentenceScore.numberOfAgree++;
            } else if (sentenceAnswer.answer === ANSWER_TYPES.DISAGREE) {
                sentenceScore.numberOfDisagree++;
            }
        } else {
            sentenceScore = this.createSentenceScore(sentenceAnswer);
            skillScore.sentenceScores.push(sentenceScore);
        }
    }

    private static createSkillScore(sentenceAnswer: any): SkillScore {
        return {
            skill: sentenceAnswer.skill._id,
            sentenceScores: [this.createSentenceScore(sentenceAnswer)]
        }
    }

    private static createSentenceScore(sentenceAnswer: any) {
        return {
            sentence: sentenceAnswer.sentence,
            numberOfAgree: sentenceAnswer.answer === ANSWER_TYPES.AGREE ? 1 : 0,
            numberOfDisagree: sentenceAnswer.answer === ANSWER_TYPES.DISAGREE ? 1 : 0
        };
    }

}