import * as StatusCodes from 'http-status-codes';
import { formError } from "../../util/errorhandler";
import BaseController from "./base.controller";
import { validate } from "../../util/input.validator";
import SurveyManager from "../interactor/survey.interactor";
import { SurveyTodoModel } from '../../data/database/schema/organization/survey/surveyTodo.schema';
import { SurveyModel } from '../../data/database/schema/organization/survey/survey.schema';
import { QuestionModel } from '../../data/database/schema/organization/survey/question.schema';

export default class SurveyController extends BaseController {
    surveyManager: SurveyManager;

    constructor(surveyManager: SurveyManager) {
        super();
        this.surveyManager = surveyManager;
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
            .then(result => this.respond(StatusCodes.OK, req, res, result))
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
            .then(result => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }

    async findManager(req: any, res: any) {
        return this.surveyManager.findManager(req.params.orgId, req.query.q)
            .then(result => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }
}