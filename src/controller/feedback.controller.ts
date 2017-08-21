import { Request, Response } from "express";
import BaseController from "./base.controller";
import FeedbackDataController from "../data/datacontroller/feedback.datacontroller";
import { formError } from "../util/errorhandler";
import Feedback from "../data/models/organization/feedback.model";
import * as StatusCodes from 'http-status-codes';

export default class FeedbackController extends BaseController {

    public async getFeedbacks(req: Request, res: Response,) {
        return FeedbackDataController.getAllFeedback(req.params.orgId, req.params.userId)
            .then((result) => res.status(StatusCodes.OK).send(result))
            .catch((error) => res.status(StatusCodes.BAD_REQUEST).json(formError(error)));
    }

    public async getSentFeedbacks(req: Request, res: Response,) {
        return FeedbackDataController.getSentFeedbacks(req.params.orgId, req.params.userId)
            .then((result) => res.status(StatusCodes.OK).send(result))
            .catch((error) => res.status(StatusCodes.BAD_REQUEST).json(formError(error)));
    }

    public async postFeedback(req: Request, res: Response) {
        return FeedbackController.validateFeedback(req.body)
            .then((feedback) => FeedbackDataController.saveFeedback(req.params.orgId, feedback))
            .then((result) => res.status(StatusCodes.OK).send(result))
            .catch((error) => res.status(StatusCodes.BAD_REQUEST).json(formError(error)));
    }

    public async getIncomingFeedbacks(req: Request, res: Response,) {
        return FeedbackDataController.getIncomingFeedbacks(req.params.orgId, req.params.userId)
            .then((result) => res.status(StatusCodes.OK).send(result))
            .catch((error) => res.status(StatusCodes.BAD_REQUEST).json(formError(error)));
    }

    public static validateFeedback(feedback: Feedback): Promise<Feedback> {
        return feedback ? Promise.resolve(feedback) : Promise.reject("Invalid request")
    }
}