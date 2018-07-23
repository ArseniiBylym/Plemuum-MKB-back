import { Document, Schema } from 'mongoose';
import { getDatabaseManager } from "../../../../../factory/database.factory";
import Survey from "../../../../models/organization/survey/survey.model";
import { QuestionModel } from './question.schema';
import { SurveyTodoModel } from './surveyTodo.schema';

interface SurveyModel extends Survey, Document {
    questions: QuestionModel[];
    surveyTodos: [SurveyTodoModel];
}

export let SurveySchema = new Schema({
    owner: {required: true, type: String, index: true},
    title: {required: false, type: String, index: true},
    numberOfQuestions: {required: false, type: Number, index: false},
    sendingOutAt: {required: false, type: Date, index: false},
}, {
    _id: true,
    timestamps: true,
    versionKey: false,
});

const SurveyCollection = (dbName: string) => getDatabaseManager().createCollection<SurveyModel>(
    dbName, "Survey", SurveySchema);


export { SurveyModel, SurveyCollection };