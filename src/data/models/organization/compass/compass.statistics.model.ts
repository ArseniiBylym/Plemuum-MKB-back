import Sentence from "./sentence.model";

interface CompassStatistics {
    user: string;
    skillScores: SkillScore[]
}

interface SkillScore {
    skill: string;
    sentenceScores: SentenceScore[];
}

interface SentenceScore {
    sentence: Sentence;
    numberOfAgree: number;
    numberOfDisagree: number;
}

export { CompassStatistics, SkillScore, SentenceScore };