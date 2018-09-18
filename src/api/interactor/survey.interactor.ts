import SurveyDataController from "../../data/datacontroller/survey.datacontroller";
import {SurveyModel} from "../../data/database/schema/organization/survey/survey.schema";
import {SurveyTodoModel} from "../../data/database/schema/organization/survey/surveyTodo.schema";
import {QuestionModel} from "../../data/database/schema/organization/survey/question.schema";
import { TEMPLATE } from "../../manager/notification/notification.manager";
import NotificationManager from "./notification.interactor";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { GroupDataController }  from "../../data/datacontroller/group.datacontroller";
import agenda from "../../util/agenda";
import * as XLSX from "xlsx";

export default class SurveyInteractor {
    private notificationManager: NotificationManager;
    groupDataController: GroupDataController;

    constructor(notificationManager: NotificationManager, groupDataController: GroupDataController) {
        this.notificationManager = notificationManager;
        this.groupDataController = groupDataController;

    }
    //dymanic survey
    async getAllSurveysByUserId(orgId: string, userId: string) {
        return SurveyDataController.getAllSurveysByUserId(orgId, userId);
    }
    async createSurveyDynamic(orgId: string, survey: SurveyModel, HR:boolean) {
        let newSurvey : SurveyModel;
        let respondentsArr = await this.analysisRespondentsId(orgId, survey.respondents, HR); 
        if (respondentsArr.length > 20 && !HR || respondentsArr.length == 0){
            throw new Error('To many respondents or invalid responsId');
        }
        else {
        return SurveyDataController.createSurvey(orgId, survey)
            .then((result) => {
                newSurvey = result;
            })
            .then((result) => {this.sendSurveys(orgId, respondentsArr, newSurvey)})
            .then(()=>{return newSurvey})
        }
    }


    async analysisRespondentsId(orgId:string, respondentsId:any, HR:boolean){
        let respondents:any = [];
        let groups:any = await this.groupDataController.getGroups(orgId);
        let groupsId = groups.map((x:any)=> {return x._id.toString()}); 
        //if organization name
        if (orgId == respondentsId[0]){
            respondents = await UserDataController.getOrganizationUsers(orgId);
        }
        //if group
        else if (groupsId.indexOf(respondentsId[0]) !== -1) {
            console.log(groupsId.indexOf(respondentsId[0]))
            let group:any = await this.groupDataController.getGroupById(orgId, respondentsId[0])
            respondents = await UserDataController.getUsersByIds(orgId, group.users)
        }
        //array of users
        else {
            respondents = await UserDataController.getUsersByIds(orgId, respondentsId);
        } 
        return respondents;
    }
    //end dymanic


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
        let surveyTodos = [];
        for (let i = 0; i < employees.length; i++) {
            if (employees[i]._id){
                    employees[i].surveyId = newSurvey._id;
                    employees[i].orgId = orgId;
                    surveyTodos.push( {
                        survey: newSurvey._id,
                        respondent: employees[i]._id
                    } as SurveyTodoModel);
                }
            }
        //write todos in db
        await SurveyDataController.createManySurveyTodo(orgId, surveyTodos);

        for (let i = 0; i < employees.length; i++) {
            try{    
                //send notification
                await this.notificationManager.sendNotificationById(employees[i]._id,
                    TEMPLATE.SURVEY());
                //send email
                 await agenda.schedule(new Date(Date.now() + i*2000),'sendSurveyNotificationEmailsInBackground',  employees[i]);
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
        let currentDate = new Date();
        //get expiritDate survey
        let expiriteSurveyTodo = await SurveyDataController.getAllSurveysTodo(orgId, userId);
        //get general survey with 2 month expirite
        let needDate = new Date(currentDate.setMonth(currentDate.getMonth() - 2));

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
        if (_id) {
            const surveyWithAnswers = await SurveyDataController.getSurveyTodo(orgId, _id, respondent);
            await agenda.schedule(new Date(Date.now() + 2000),'sendSurveyAnswers', surveyWithAnswers);
            return surveyWithAnswers;
        }
    }

    async setSurveyTodoManager(orgId: string, surveyTodoId: string, managerId: string) {
        return SurveyDataController.setSurveyTodoManager(orgId, surveyTodoId, managerId);
    }

    async findManager(orgId: string, keyword: string) {
        return SurveyDataController.findManager(orgId, keyword);
    }
}