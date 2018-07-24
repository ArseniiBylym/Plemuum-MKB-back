import SurveyDataController from "../../data/datacontroller/survey.datacontroller";
import {SurveyModel} from "../../data/database/schema/organization/survey/survey.schema";
import {SurveyTodoModel} from "../../data/database/schema/organization/survey/surveyTodo.schema";
import {QuestionModel} from "../../data/database/schema/organization/survey/question.schema";
import {UserModel} from "../../data/database/schema/common/user.schema";
import { TEMPLATE } from "../../manager/notification/notification.manager";
import NotificationManager from "./notification.interactor";
import UserDataController from "../../data/datacontroller/user.datacontroller";
export default class SurveyInteractor {
    private notificationManager: NotificationManager;

    constructor(notificationManager: NotificationManager) {
        this.notificationManager = notificationManager;
    }

    async getAllSurveys(orgId: string) {
        return SurveyDataController.getAllSurveys(orgId);
    }

    async getSurvey(orgId: string, surveyId: string) {
        return SurveyDataController.getSurvey(orgId, surveyId);
    }

    async createSurvey(orgId: string, survey: SurveyModel) {
        let newSurvey : SurveyModel;
        let users : UserModel[];
        return SurveyDataController.createSurvey(orgId, survey)
            .then((result) => {
                newSurvey = result;
                return UserDataController.getOrganizationUsers(orgId);
            })
            .then((result) => {
                users = result;
                let items : SurveyTodoModel[] = [];
                for (let i=0;i<users.length;i++){
                    items.push({respondent: users[i]._id, survey: newSurvey._id } as SurveyTodoModel);
                }
                return SurveyDataController.createManySurveyTodo(orgId, items);
            })
            .then((result) => {
                this.sendSurveysTodo(orgId, users);
                return newSurvey;
            });
    }

    async sendSurveysTodo(orgId: string, employees: UserModel[]) {
        for (let i = 0; i < employees.length; i++) {
            try {
                await this.notificationManager.sendNotificationById(employees[i]._id,
                    TEMPLATE.SURVEY());
            } catch (error) {
                console.error(error);
            }

        }
    }

    async getQuestion(orgId: string, questionId: string) {
        return SurveyDataController.getQuestion(orgId, questionId);
    }

    async updateQuestion(orgId: string, question: QuestionModel) {
        return SurveyDataController.updateQuestion(orgId, question);
    }

    async getAllSurveysTodo(orgId: string, userId: string) {
        let allSurveysAfterDate : string[];
        let currentDate = new Date();
        let needDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));

        return SurveyDataController.getSurveysAfterDate(orgId, needDate)
        .then((result) => {
            allSurveysAfterDate = result.map((item) => { return String(item._id) });
            return SurveyDataController.getAllSurveysTodo(orgId, userId);
        })
        .then((result) => {
            let allSurveysTodo = result.map((item) => { return String(item.survey) });
            let needSurveysTodo = allSurveysAfterDate.filter((item) => { return allSurveysTodo.indexOf(item) < 0 });
            if (needSurveysTodo && needSurveysTodo.length) {
                let need = needSurveysTodo.map((item) => { return { survey: item, respondent: userId } as SurveyTodoModel } );
                return SurveyDataController.createManySurveyTodo(orgId, need)
                    .then((result) => {
                        return SurveyDataController.getAllSurveysTodo(orgId, userId)
                    })
                    .then((result) => {
                        return result;
                    });
            } else {
                return result;
            }
        })
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