import { Document, Schema } from 'mongoose';
import { getDatabaseManager } from "../../../../../factory/database.factory";
import SurveyTodo from "../../../../models/organization/survey/surveyTodo.model";
import { AnswerModel } from './answer.schema';


interface SurveyTodoModel extends SurveyTodo, Document {
    answers: [AnswerModel];
}

export let SurveyTodoSchema = new Schema({
    manager: { required: false, type: String, index: true },
    respondent: { required: true, type: String, index: true },
    survey: { required: true, type: Schema.Types.ObjectId, index: true },
    isCompleted: { required: true, type: Boolean, default: false, index: false },
    completedAt: { required: false, type: Date, index: false },
    surveyType:  { required: false, type: Number, index: true },
}, {
    _id: true,
    timestamps: true,
    versionKey: false,
});

const SurveyTodoCollection = (dbName: string) => getDatabaseManager().createCollection<SurveyTodoModel>(dbName, "SurveyTodo", SurveyTodoSchema);


export { SurveyTodoModel, SurveyTodoCollection };