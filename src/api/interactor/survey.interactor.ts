import SurveyDataController from "../../data/datacontroller/survey.datacontroller";
import {SurveyModel} from "../../data/database/schema/organization/survey/survey.schema";
import {SurveyTodoModel} from "../../data/database/schema/organization/survey/surveyTodo.schema";
import {QuestionModel} from "../../data/database/schema/organization/survey/question.schema";
import { TEMPLATE } from "../../manager/notification/notification.manager";
import NotificationManager from "./notification.interactor";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import agenda from "../../util/agenda";
import * as XLSX from "xlsx";

export default class SurveyInteractor {
    private notificationManager: NotificationManager;

    constructor(notificationManager: NotificationManager) {
        this.notificationManager = notificationManager;
    }

    async getAllUserWhoUncompletedSurvey(orgId: string, surveyId: string) {

        return SurveyDataController.getAllUserWhoUncompletedSurvey(orgId, surveyId)
            .then(async (result:any) => {
                //result export to xlsx
                const ws = await XLSX.utils.json_to_sheet(result,
                    {header:["employeeId","employeeFirstName","employeeLastName", "employeeEmail"]});
                const wb = await XLSX.utils.book_new();
                await XLSX.utils.book_append_sheet(wb, ws, "uncompleted");
                /* generate an XLSX file */
                await XLSX.writeFile(wb, `./media/${surveyId}_survey_uncompleted.xlsx`);
                return result;
            })
    }

    async getAllAnswersSurvey(orgId: string, surveyId: string) {

        return SurveyDataController.getAllAnswersSurvey(orgId, surveyId)
            .then(async (result:any) => {
                //result export to xlsx
                const ws = await XLSX.utils.json_to_sheet(result,
                    {header:["createdAt","employeeId","employeeFirstName","employeeLastName",
                            "employeeEmail","isCompleted", "updatedAt", "managerId", "managerFirstName",
                        "managerLastName", "managerEmail"]});
                const wb = await XLSX.utils.book_new();
                await XLSX.utils.book_append_sheet(wb, ws, "survey_answers");
                /* generate an XLSX file */
                await XLSX.writeFile(wb, `./media/${surveyId}_survey_answers.xlsx`);
                return result;
            })
    }

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
                return UserDataController.getOrganizationUsers(orgId);
            })
            .then((result) => {
                this.sendSurveys(orgId, result, newSurvey);
                return newSurvey;
            });
    }

    async sendSurveys(orgId: string, employees: any, newSurvey:any) {
        for (let i = 0; i < employees.length; i++) {
            try {
                employees[i].surveyId = newSurvey._id;
                employees[i].orgId = orgId;
                //write todos in db
                let survey = {
                    survey: newSurvey._id,
                    respondent: employees[i]._id
                } as SurveyTodoModel;
                await SurveyDataController.createSurveyTodo(orgId, survey);

                //send notification
                await this.notificationManager.sendNotificationById(employees[i]._id,
                    TEMPLATE.SURVEY());
                //send email
                await agenda.schedule(new Date(Date.now() + i*2000),'sendSurveyNotificationEmailsInBackground',  employees[i]);
            } catch (error) {
                console.error(error);
                break
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
        let currentDate = new Date();
        let needDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));

        let allSurveysAfterDate = (await SurveyDataController.getSurveysAfterDate(orgId, needDate)).map((item) => { return String(item._id) });

        let allSurveysTodo = (await SurveyDataController.getAllSurveyTodos(orgId, userId)).map((item) => { return String(item.survey._id) });
        let needSurveysTodo = allSurveysAfterDate.filter((item) => { return allSurveysTodo.indexOf(item) < 0 });
        if (needSurveysTodo && needSurveysTodo.length) {
            let need = needSurveysTodo.map((item) => { return { survey: item, respondent: userId } as SurveyTodoModel } );
            await SurveyDataController.createManySurveyTodo(orgId, need);
        }
        return await SurveyDataController.getAllSurveysTodo(orgId, userId);
    }

    async getSurveyTodo(orgId: string, surveyTodoId: string, userId: string) {
        return SurveyDataController.getSurveyTodo(orgId, surveyTodoId, userId);
    }

    async saveSurveyTodo(orgId: string, surveyTodo: SurveyTodoModel) {
        const result = await SurveyDataController.saveSurveyTodo(orgId, surveyTodo);
        const {_id, respondent} = result;
        if (_id){
            return await SurveyDataController.getSurveyTodo(orgId, _id, respondent);

            // const surveyWithAnswers = await SurveyDataController.getSurveyTodo(orgId, _id, respondent);
            // return await agenda.schedule(new Date(Date.now() + 2000),'sendSurveyAnswers',  surveyWithAnswers);
        }
    }

    async setSurveyTodoManager(orgId: string, surveyTodoId: string, managerId: string) {
        return SurveyDataController.setSurveyTodoManager(orgId, surveyTodoId, managerId);
    }

    async findManager(orgId: string, keyword: string) {
        return SurveyDataController.findManager(orgId, keyword);
    }
}