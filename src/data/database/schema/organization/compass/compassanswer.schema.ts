import { Connection, Document, Model, Schema } from 'mongoose';
import { getDatabaseManager } from "../../../../../factory/database.factory";
import CompassAnswer, { ANSWER_TYPES } from "../../../../models/organization/compass/compassanswer.model";
import { SentenceSchema, SkillSchema } from "./skill.schema";

interface CompassAnswerModel extends CompassAnswer, Document {
}

export let CompassAnswerSchema = new Schema({
    compassTodo: {required: true, type: String, index: true},
    sender: {required: true, type: String, index: true},
    sentencesAnswer: [
        new Schema({
            answer: {
                required: true,
                type: String,
                index: false,
                enum: [ANSWER_TYPES.SKIP, ANSWER_TYPES.AGREE, ANSWER_TYPES.DISAGREE]
            },
            sentence: {required: true, type: SentenceSchema, index: false},
            skill: {required: true, type: SkillSchema, index: false}
        }, {_id: false})
    ]
}, {
    versionKey: false,
    timestamps: true,
});

const CompassAnswerCollection = (dbName: string) => getDatabaseManager().createCollection<CompassAnswerModel>(
    dbName, "CompassAnswer", CompassAnswerSchema);


export { CompassAnswerModel, CompassAnswerCollection };