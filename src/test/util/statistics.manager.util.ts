import { ANSWER_TYPES } from "../../data/models/organization/compass/compassanswer.model";

const createSentence = (num: number) => {
    return {
        _id: `sentenceId${num}`,
        message: `sentence${num}`
    }
};

const createSkill = (num: number, ...sentences: any[]) => {
    return {
        _id: `skillId${num}`,
        name: `skill name ${num}`,
        sentences: sentences,
        inactiveSentences: []
    }
};

const skills = [
    createSkill(1, createSentence(1), createSentence(2)),
    createSkill(2, createSentence(3)),
    createSkill(3, createSentence(4), createSentence(5))
];

const createSentenceScore = (sentenceNumber: number, agrees: number, disagrees: number) => {
    return {
        sentence: createSentence(sentenceNumber),
        numberOfAgree: agrees,
        numberOfDisagree: disagrees
    }
};

const createSentenceAnswer = (skill: any, sentenceNumber: number, answer: ANSWER_TYPES) => {
    return {
        skill: skill,
        sentence: createSentence(sentenceNumber),
        answer: answer
    }
};

const createCompassAnswer = (...sentenceAnswers: any[]) => {
    return {
        compassTodo: "compassTodo",
        sender: "sender",
        sentencesAnswer: sentenceAnswers
    }
};

const createSkillScore = (skill: any, ...sentenceScores: any[]) => {
    return {
        skill: skill._id,
        sentenceScores: sentenceScores
    }
};

export {
    createSentence,
    createSkill,
    skills,
    createSentenceScore,
    createSentenceAnswer,
    createCompassAnswer,
    createSkillScore
}