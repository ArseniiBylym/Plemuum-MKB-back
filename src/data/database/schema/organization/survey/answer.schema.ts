import { Document, Schema } from 'mongoose';
import { getDatabaseManager } from "../../../../../factory/database.factory";
import Answer from "../../../../models/organization/survey/answer.model";

interface AnswerModel extends Answer, Document {
}

export let AnswerSchema = new Schema({
    surveyTodo: { type: Schema.Types.ObjectId, index: true },
    question: { type: Schema.Types.ObjectId, index: true },
    questionText: { required: true, type: String, index: false },
    answerText: { required: false, type: String, index: false },
    required: { required: false, type: Boolean, index: false },
    min: {required: false, type: Number, index: false, default: null },
    max: {required: false, type: Number, index: false, default: null },
}, {
    _id: true,
    timestamps: true,
    versionKey: false,
});

const AnswerCollection = (dbName: string) => getDatabaseManager().createCollection<AnswerModel>(dbName, "Answer", AnswerSchema);


export { AnswerModel, AnswerCollection };