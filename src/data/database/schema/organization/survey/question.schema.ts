import { Document, Schema } from 'mongoose';
import { getDatabaseManager } from "../../../../../factory/database.factory";
import Question from "../../../../models/organization/survey/question.model";

interface QuestionModel extends Question, Document {
}

export let QuestionSchema = new Schema({
    type: { required: false, type: String, index: true  },
    answerValues: { required: false, type: Array, index: true  },
    survey: { type: Schema.Types.ObjectId, index: true  },
    text: {required: true, type: String, index: true },
    required: {required: false, type: Boolean, index: false, default: false },
    min: {required: false, type: Number, index: false, default: null },
    max: {required: false, type: Number, index: false, default: null },
}, {
    _id: true,
    timestamps: true,
    versionKey: false,
});

const QuestionCollection = (dbName: string) => getDatabaseManager().createCollection<QuestionModel>(
    dbName, "Question", QuestionSchema);

export { QuestionModel, QuestionCollection };