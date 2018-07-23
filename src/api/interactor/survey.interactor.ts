import SurveyDataController from "../../data/datacontroller/survey.datacontroller";
import { SurveyModel } from "../../data/database/schema/organization/survey/survey.schema";
import { SurveyTodoModel } from "../../data/database/schema/organization/survey/surveyTodo.schema";
import { QuestionModel } from "../../data/database/schema/organization/survey/question.schema";
import sendSurveysTodo from "../../workers/sendSurveysTodo";

export default class SurveyInteractor {
    async getAllSurveys(orgId: string) {
        return SurveyDataController.getAllSurveys(orgId);
    }

    async getSurvey(orgId: string, surveyId: string) {
        return SurveyDataController.getSurvey(orgId, surveyId);
    }

    async createSurvey(orgId: string, survey: SurveyModel) {
        let newSurvey : SurveyModel;
        return SurveyDataController.createSurvey(orgId, survey)
        .then((result) => {
            newSurvey = result;
            return SurveyDataController.getEmployees(orgId);
        })
        .then((result) => {
            //sendSurveysTodo(orgId, newSurvey._id, result);
            return newSurvey;
        });
    }

    async getQuestion(orgId: string, questionId: string) {
        return SurveyDataController.getQuestion(orgId, questionId);
    }

    async updateQuestion(orgId: string, question: QuestionModel) {
        return SurveyDataController.updateQuestion(orgId, question);
    }

    async getAllSurveysTodo(orgId: string, userId: string) {
        return SurveyDataController.getAllSurveysTodo(orgId, userId);
    }

    async getSurveyTodo(orgId: string, surveyTodoId: string, userId: string) {
        return SurveyDataController.getSurveyTodo(orgId, surveyTodoId, userId);
    }

    async saveSurveyTodo(orgId: string, surveyTodo: SurveyTodoModel) {
        return SurveyDataController.saveSurveyTodo(orgId, surveyTodo);
    }

    async setSurveyTodoManager(orgId: string, surveyTodoId: string, managerId: string) {
        return SurveyDataController.setSurveyTodoManager(orgId, surveyTodoId, managerId);
    }

    async findManager(orgId: string, keyword: string) {
        return SurveyDataController.findManager(orgId, keyword);
    }
}