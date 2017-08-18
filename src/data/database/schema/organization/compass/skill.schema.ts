import { Connection, Document, Model, Schema } from 'mongoose';
import { getDatabaseManager } from "../../../../../factory/database.factory";
import Skill from "../../../../models/organization/compass/skill.model";
import Sentence from "../../../../models/organization/compass/sentence.model";

interface SentenceModel extends Sentence, Document {
}

export let SentenceSchema = new Schema({
    message: {required: true, type: String, index: true},
}, {
    _id: true,
    timestamps: true,
});

interface SkillModel extends Skill, Document {
}

export let SkillSchema = new Schema({
    name: {required: true, type: String, index: true},
    sentences: {required: false, type: [SentenceSchema], index: true},
    inactiveSentences: {required: false, type: [SentenceSchema], index: true},
}, {timestamps: true});

const SkillCollection = (dbName: string) => getDatabaseManager().createCollection<SkillModel>(
    dbName, "Skill", SkillSchema);


export { SkillModel, SkillCollection };