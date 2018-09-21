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
import * as _ from "lodash";

export default class SurveyInteractor {
    private notificationManager: NotificationManager;
    groupDataController: GroupDataController;

    constructor(notificationManager: NotificationManager, groupDataController: GroupDataController) {
        this.notificationManager = notificationManager;
        this.groupDataController = groupDataController;

    }
    //Survey2 interactors
    async getAllSurveysByUserId(orgId: string, userId: string) {
        return SurveyDataController.getAllSurveysByUserId(orgId, userId);
    }
    async createSurveyDynamic(orgId: string, survey: SurveyModel, HR:boolean) {
        let newSurvey : SurveyModel;
        let respondentsArr = await this.analysisRespondentsId(orgId, survey.respondents); 
        if (respondentsArr.length > 20 && !HR || respondentsArr.length == 0){
            throw new Error('To many respondents or invalid Id of respondent');
        }
        else {
        return SurveyDataController.createSurveyDynamic(orgId, survey)
            .then((result) => {
                newSurvey = result;
            })
            .then((result) => {this.sendSurveys(orgId, respondentsArr, newSurvey)})
            .then(()=>{return newSurvey})
        }
    }

    async analysisRespondentsId(orgId:string, respondentsId:any){
        let respondents:any = [];
        let groups:any = await this.groupDataController.getGroups(orgId);
        let groupsId = groups.map((x:any)=> {return x._id.toString()}); 
        //if organization name
        if (orgId == respondentsId[0]){
            respondents = await UserDataController.getOrganizationUsers(orgId);
        }
        //if group
        else if (groupsId.indexOf(respondentsId[0]) !== -1) {
            for (let i = 0; i<respondentsId.length; i++){
            let group:any = await this.groupDataController.getGroupById(orgId, respondentsId[i]);
            respondents = respondents.concat(await UserDataController.getUsersByIds(orgId, group.users));
            }
        }
        //array of users
        else {
            try{
                respondents = await UserDataController.getUsersByIds(orgId, respondentsId);
                }
            catch(error) {
                console.error(error.message);
            }
        } 
        return respondents = _.uniqBy(respondents, (item:any)=> item._id.toString());
    }

    async getAllAnswersSurveyById(orgId: string, surveyId: string, surveyType: string, userId: string) {
        return SurveyDataController.getAllAnswersSurveyById(orgId, surveyId)
            .then(async (result:any) => {
                //result export to xlsx
                const ws = await XLSX.utils.json_to_sheet(result,{skipHeader:true});
                const wb = await XLSX.utils.book_new();
                await XLSX.utils.book_append_sheet(wb, ws, "survey_answers");
                /* generate an XLSX file */
                let survey:any = await this.getSurvey(orgId, surveyId);
                if (survey.owner != userId) throw new Error ("It's not your survey!");
                let path = `./media/${survey.title}_${survey._id}.xlsx`;
                await XLSX.writeFile(wb, path);
                return [path, `${survey.title}.xlsx`];
            })
    }

    async getSurveyDetail(orgId: string, surveyId: string) {
        return SurveyDataController.getSurveyDetail(orgId, surveyId)
        .then(async (result:any) => {
             let respondentsId = await this.analysisRespondentsId(orgId, result.respondents);
             let usersId = await UserDataController.getUsersByIds(orgId, respondentsId);
             let usersFirstNameImgUrl = usersId.map((user:any)=> {return {name: user.firstName, imgUrl: user.pictureUrl}});
             result.respondents = usersFirstNameImgUrl;
             return result;  
        })
    }
    //end survey2


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
                    } as any);
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
        //get old type of survey
        let allOldSurveysId:any = (await SurveyDataController.getAllSurveys(orgId)).filter((item) => !item.expiritDate );
        allOldSurveysId = allOldSurveysId.map((item:any) => { return String(item._id)} );
        //all survey todo
        let allSurveysTodo = (await SurveyDataController.getAllSurveyTodos(orgId, userId)).map((item) => { return String(item.survey._id) });
        // filter survey with not inculde in survey todo
        let needSurveysTodo = allOldSurveysId.filter((item:any) => { return allSurveysTodo.indexOf(item) < 0 });
        if (needSurveysTodo && needSurveysTodo.length) {
        //create survey todo who later registred
            let need = needSurveysTodo.map((item:any) => { return { survey: item, respondent: userId } as SurveyTodoModel } );
            await SurveyDataController.createManySurveyTodo(orgId, need);
        }
        let currentDate = new Date();
        //get all uncomplited survey
        let uncomplitedSurveyTodo = await SurveyDataController.getAllSurveysTodo(orgId, userId);
        let filterExpiritDateSurveyTodo = uncomplitedSurveyTodo.filter(x => x.survey.expiritDate ? x.survey.expiritDate >= currentDate : true);
        return filterExpiritDateSurveyTodo;
    }

    async getSurveyTodo(orgId: string, surveyTodoId: string, userId: string) {
        return SurveyDataController.getSurveyTodo(orgId, surveyTodoId, userId);
    }

    async saveSurveyTodo(orgId: string, surveyTodo: SurveyTodoModel) {
        const result = await SurveyDataController.saveSurveyTodo(orgId, surveyTodo);
        const {_id, respondent} = result;
        if (_id) {
            const surveyWithAnswers = await SurveyDataController.getSurveyTodo(orgId, _id, respondent);

            if (surveyWithAnswers.surveyTodo.surveyType && surveyWithAnswers.surveyTodo.surveyType == 2) {
                return surveyWithAnswers;
            } 
            //await agenda.schedule(new Date(Date.now() + 2000),'sendSurveyAnswers', surveyWithAnswers);
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