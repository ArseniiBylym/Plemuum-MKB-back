import * as StatusCodes from 'http-status-codes';
import { formError } from "../../util/errorhandler";
import BaseController from "./base.controller";
import { validate } from "../../util/input.validator";
import SurveyManager from "../interactor/survey.interactor";
import { SurveyTodoModel } from '../../data/database/schema/organization/survey/surveyTodo.schema';
import { SurveyModel } from '../../data/database/schema/organization/survey/survey.schema';
import { SurveyTemplateModel } from '../../data/database/schema/organization/survey/surveyTemplate.schema';
import { QuestionModel } from '../../data/database/schema/organization/survey/question.schema';
import * as path from 'path';

export default class SurveyController extends BaseController {
    surveyManager: SurveyManager;

    constructor(surveyManager: SurveyManager) {
        super();
        this.surveyManager = surveyManager;
    }

    //survey2 controller
    async getAllSurveysByUserId(req: any, res: any) {
        return this.surveyManager.getAllSurveysByUserId(req.params.orgId, req.user._id)
            .then(result => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }

    async createSurveyDynamic(req: any, res: any) {

        req.checkBody('title', 'Missing title').notEmpty();
        req.checkBody('description', 'Missing description').notEmpty();
        req.checkBody('expiritDate', 'Missing expiritDate').notEmpty();
        
        if (!await validate(req, res)) {
            return;
        }
        if (req.body.questions && req.body.questions.length > 20) { this.respond(StatusCodes.FORBIDDEN, req, res, { error: "To many question." }); }
        let HR = (req.user.roles && req.user.roles.indexOf('HR') !== -1) ? true : false; 
        req.body.owner = req.user._id;
        req.body.type = req.params.surveyType ? req.params.surveyType : null; 
        let survey: SurveyModel = req.body;
        return this.surveyManager.createSurveyDynamic(req.params.orgId, survey, HR)
            .then(result => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }

    async getAllAnswersSurveyById(req: any, res: any) {
        return this.surveyManager.getAllAnswersSurveyById(req.params.orgId, req.params.surveyId, req.params.surveyType, req.user._id)
            .then(result => res.download(path.join(__dirname + '../../../../'+result[0]),result[1] ))
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }
    
    async getSurveyDetail(req: any, res: any) {
        return this.surveyManager.getSurveyDetail(req.params.orgId, req.params.surveyId)
            .then(result => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }

    //surveyTemplate
    async getAllSurveyTemplatesByUserId(req: any, res: any) {
        return this.surveyManager.getAllSurveyTemplatesByUserId(req.params.orgId, req.user._id, req.user.roles)
            .then(result => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }

    async createSurveyTemplate(req: any, res: any) {
        req.checkBody('title', 'Missing survey name').notEmpty();

        if (!await validate(req, res)) {
            return;
        }
        
        req.body.owner = req.user._id;

        let surveyTemplate: SurveyTemplateModel = req.body;

        return this.surveyManager.createSurveyTemplate(req.params.orgId, surveyTemplate)
            .then(result => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }

    async deleteSurveyTemplateById(req: any, res: any) {
        return this.surveyManager.deleteSurveyTemplateById(req.params.orgId, req.body.surveyTemplateId)
            .then(result => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }

    //end survey2

    async getAllAnswersSurvey(req: any, res: any) {
        return this.surveyManager.getAllAnswersSurvey(req.params.orgId, req.params.surveyId)
            .then(result => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }

    async getAllUserWhoUncompletedSurvey(req: any, res: any) {
        return this.surveyManager.getAllUserWhoUncompletedSurvey(req.params.orgId, req.params.surveyId)
            .then(result => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }

    async getAllSurveys(req: any, res: any) {
        return this.surveyManager.getAllSurveys(req.params.orgId)
            .then(result => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }

    async getSurvey(req: any, res: any) {
        return this.surveyManager.getSurvey(req.params.orgId, req.params.surveyId)
            .then(result => {
                if (!result) { this.respond(StatusCodes.NOT_FOUND, req, res, { error: "Survey not found." }); }
                else { this.respond(StatusCodes.OK, req, res, result); }
            })
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }

    async createSurvey(req: any, res: any) {
        req.checkBody('title', 'Missing survey name').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        req.body.owner = req.user._id;

        let survey: SurveyModel = req.body;

        return this.surveyManager.createSurvey(req.params.orgId, survey)
            .then(result => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }

    async getQuestion(req: any, res: any) {
        return this.surveyManager.getQuestion(req.params.orgId, req.params.questionId)
            .then(result => {
                if (!result) { this.respond(StatusCodes.NOT_FOUND, req, res, { error: "Qestion not found." }); }
                else { this.respond(StatusCodes.OK, req, res, result); }
            })
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }

    async updateQuestion(req: any, res: any) {
        let question : QuestionModel = req.body;
        question._id = req.params.questionId;
        delete question.survey;
        return this.surveyManager.updateQuestion(req.params.orgId, question)
            .then(result => {
                if (!result) { this.respond(StatusCodes.NOT_FOUND, req, res, { error: "Question not found." }); }
                else { this.respond(StatusCodes.OK, req, res, result) }
            })
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }

    async getAllSurveysTodo(req: any, res: any) {
        return this.surveyManager.getAllSurveysTodo(req.params.orgId, req.user._id)
            .then(result => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }

    async getSurveyTodo(req: any, res: any) {
        return this.surveyManager.getSurveyTodo(req.params.orgId, req.params.surveyTodoId, req.user._id)
            .then(result => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }

    async saveSurveyTodo(req: any, res: any) {
        let surveyTodo : SurveyTodoModel = req.body;
        surveyTodo._id = req.params.surveyTodoId;
        surveyTodo.respondent = req.user._id;
        return this.surveyManager.saveSurveyTodo(req.params.orgId, surveyTodo)
            .then(result => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }

    async setSurveyTodoManager(req: any, res: any) {
        return this.surveyManager.setSurveyTodoManager(req.params.orgId, req.params.surveyTodoId, req.body.manager)
            .then(result => {
                if (!result) { this.respond(StatusCodes.NOT_FOUND, req, res, { error: "Survey to do not found." }); }
                else { this.respond(StatusCodes.OK, req, res, result) }
            })
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }

    async findManager(req: any, res: any) {
        return this.surveyManager.findManager(req.params.orgId, req.query.q)
            .then(result => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }
}