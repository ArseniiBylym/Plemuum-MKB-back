import { Document, Schema } from 'mongoose';
import { getDatabaseManager } from "../../../../../factory/database.factory";
import Question from "../../../../models/organization/survey/question.model";

interface QuestionModel extends Question, Document {
}

export let QuestionSchema = new Schema({
    survey: { type: Schema.Types.ObjectId, index: true  },
    text: {required: false, type: String, index: true },
    required: {required: false, type: Boolean, index: false },
}, {
    _id: true,
    timestamps: true,
    versionKey: false,
});

const QuestionCollection = (dbName: string) => getDatabaseManager().createCollection<QuestionModel>(
    dbName, "Question", QuestionSchema);


export { QuestionModel, QuestionCollection };