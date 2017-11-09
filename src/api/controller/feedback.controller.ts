import BaseController from "./base.controller";
import { formError } from "../../util/errorhandler";
import * as StatusCodes from 'http-status-codes';
import { validate } from "../../util/input.validator";
import FeedbackManager from "../manager/feedback.manager";

export default class FeedbackController extends BaseController {

    feedbackManager: FeedbackManager;

    constructor(feedbackManager: FeedbackManager) {
        super();
        this.feedbackManager = feedbackManager;
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

    async postFeedback(req: any, res: any) {
        req.checkBody('recipientId', 'Missing recipientId').notEmpty();
        req.checkBody('message', 'Missing message').notEmpty();
        req.checkBody('type', 'Missing type').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        req.body.senderId = req.user._id;

        return this.feedbackManager.postFeedback(req.params.orgId, req.body)
            .then((result) => this.respond(StatusCodes.CREATED, req, res, result))
            .catch((err) => res.status(this.getErrorStatus(err)).send(formError(err)));
    }
}