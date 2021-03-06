import BaseController from "./base.controller";
import { formError } from "../../util/errorhandler";
import * as StatusCodes from 'http-status-codes';
import { validate } from "../../util/input.validator";
import FeedbackManager from "../interactor/feedback.interactor";
import UserDataController from "../../data/datacontroller/user.datacontroller";

export default class FeedbackController extends BaseController {

    feedbackManager: FeedbackManager;

    constructor(feedbackManager: FeedbackManager) {
        super();
        this.feedbackManager = feedbackManager;
    }

    async sendReportAbusiveFeedback(req: any, res: any,) {
        return this.feedbackManager.sendReportAbusiveFeedback(req.params.orgId, req.params.feedbackId)
            .then((result) => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }

    async getFeedbacks(req: any, res: any,) {
        return this.feedbackManager.getFeedbacks(req.params.orgId, req.user._id)
            .then((result) => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }

    async getSentFeedbacks(req: any, res: any,) {
        return this.feedbackManager.getSentFeedbacks(req.params.orgId, req.user._id)
            .then((result) => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }

    async getIncomingFeedbacks(req: any, res: any,) {
        return this.feedbackManager.getIncomingFeedbacks(req.params.orgId, req.user._id)
            .then((result) => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }

    async getSentFeedbacksReport(req: any, res: any,) {
        return this.feedbackManager.getSentFeedbacksReport(req.params.orgId, req.params.userId)
            .then((result) => {
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");
                res.status(200).send(result);
            })
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }

    async getIncomingFeedbacksReport(req: any, res: any,) {
        return this.feedbackManager.getIncomingFeedbacksReport(req.params.orgId, req.params.userId)
            .then((result) => {
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");
                res.status(200).send(result);
            })
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }

    async postFeedback(req: any, res: any) {
        req.checkBody('recipientId', 'Missing recipientId').notEmpty();
        req.checkBody('message', 'Missing message').notEmpty();
        req.checkBody('type', 'Missing type').notEmpty();

        if (!await validate(req, res)) {
            return;
        }
        let {isActive} = await UserDataController.checkActiveUserById(req.body.recipientId);

        if (!isActive){
            res.status(422).send(formError(new Error ("The user has been deleted from the Plenuum")))
        }

        req.body.senderId = req.user._id;

        return this.feedbackManager.postFeedback(req.params.orgId, req.user, req.body)
            .then((result) => this.respond(StatusCodes.CREATED, req, res, result))
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }
}