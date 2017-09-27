import BaseController from "./base.controller";
import FeedbackDataController from "../../data/datacontroller/feedback.datacontroller";
import { formError } from "../../util/errorhandler";
import * as StatusCodes from 'http-status-codes';
import { validate } from "../../util/input.validator";

export default class FeedbackController extends BaseController {

    async getFeedbacks(req: any, res: any,) {
        return FeedbackDataController.getAllFeedback(req.params.orgId, req.user._id)
            .then((result) => res.status(StatusCodes.OK).send(result))
            .catch((err) => res.status(BaseController.getErrorStatus(err)).send(formError(err)));
    }

    async getSentFeedbacks(req: any, res: any,) {
        return FeedbackDataController.getSentFeedbacks(req.params.orgId, req.user._id)
            .then((result) => res.status(StatusCodes.OK).send(result))
            .catch((err) => res.status(BaseController.getErrorStatus(err)).send(formError(err)));
    }

    async getIncomingFeedbacks(req: any, res: any,) {
        return FeedbackDataController.getIncomingFeedbacks(req.params.orgId, req.user._id)
            .then((result) => res.status(StatusCodes.OK).send(result))
            .catch((err) => res.status(BaseController.getErrorStatus(err)).send(formError(err)));
    }

    async postFeedback(req: any, res: any) {
        req.checkBody('senderId', 'Missing senderId').notEmpty();
        req.checkBody('recipientId', 'Missing recipientId').notEmpty();
        req.checkBody('context', 'Missing context').notEmpty();
        req.checkBody('message', 'Missing message').notEmpty();
        req.checkBody('type', 'Missing type').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        return FeedbackDataController.saveFeedback(req.params.orgId, req.body)
            .then((result) => res.status(StatusCodes.CREATED).send(result))
            .catch((err) => res.status(BaseController.getErrorStatus(err)).send(formError(err)));
    }
}