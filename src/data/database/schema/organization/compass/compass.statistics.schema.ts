import { Connection, Document, Model, Schema } from 'mongoose';
import { getDatabaseManager } from "../../../../../factory/database.factory";
import {
    CompassStatistics,
    SentenceScore,
    SkillScore
} from "../../../../models/organization/compass/compass.statistics.model";
import { SentenceSchema } from "./skill.schema";


export const SentenceScoreSchema = new Schema({
    sentence: {required: true, type: SentenceSchema, index: true},
    numberOfAgree: {required: true, type: Number, index: false},
    numberOfDisagree: {required: true, type: Number, index: false},
}, {
    timestamps: true,
    versionKey: false
});

export const SkillScoreSchema = new Schema({
    skill: {required: true, type: String, index: true},
    sentenceScores: {required: true, type: [SentenceScoreSchema], index: false},
}, {
    timestamps: true,
    versionKey: false
});

export const CompassStatisticsSchema = new Schema({
    user: {required: true, type: String, index: true},
    skillScores: {required: true, type: [SkillScoreSchema], index: false},
}, {
    _id: true,
    timestamps: true,
    versionKey: false
});


interface SentenceScoreModel extends SentenceScore, Document {
}

interface SkillScoreModel extends SkillScore, Document {
}

interface CompassStatisticsModel extends CompassStatistics, Document {
}

const StatisticsCollection = (dbName: string) => getDatabaseManager().createCollection<CompassStatisticsModel>(
    dbName, "CompassStatistics", CompassStatisticsSchema);

export { CompassStatisticsModel, StatisticsCollection };