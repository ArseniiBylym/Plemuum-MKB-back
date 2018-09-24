import { Document, Schema } from 'mongoose';
import { getDatabaseManager } from "../../../../../factory/database.factory";
import SurveyTemplate from "../../../../models/organization/survey/surveyTemplate.model";
import { QuestionModel } from './question.schema';
import { SurveyTodoModel } from './surveyTodo.schema';

interface SurveyTemplateModel extends SurveyTemplate, Document {
    questions: QuestionModel[];
    surveyTodos: [SurveyTodoModel];
}

export let SurveyTemplateSchema = new Schema({
    type: {required: false, type: Number, index: true},
    templateTitle: {required: true, type: String, index: true},
    visible: {required: false, type: Array, index: true},
    description: {required: false, type: String, index: true},
    respondents: {required: false, type: Array, index: true},
    expiritDate: {required: false, type: Date, index: true},
    owner: {required: true, type: String, index: true},
    title: {required: false, type: String, index: true},
    numberOfQuestions: {required: false, type: Number, index: false},
    createdAt: {required: false, type: Date, index: false},
    questions: {required: false, type: Array, index: true}
}, {
    _id: true,
    timestamps: true,
    versionKey: false,
});

const SurveyTemplateCollection = (dbName: string) => getDatabaseManager().createCollection<SurveyTemplateModel>(
    dbName, "SurveyTemplate", SurveyTemplateSchema);


export { SurveyTemplateModel, SurveyTemplateCollection };