import { Request, Response } from "express";
import Feedback from "../../data/models/feedback.model";
import FeedbackDataController from '../../data/datacontroller/feedback.datacontroller'
import { Error } from 'mongoose';
import * as ErrorHandler from '../../util/errorhandler';

export default class FeedbackController {
    private feedbackDataController: FeedbackDataController;

    constructor(feedbackDataController: FeedbackDataController) {
        this.feedbackDataController = feedbackDataController;
    }

    public getFeedbacks(req: Request, res: Response, next: Function) {
        this.feedbackDataController.getAllFeedback(req.params.userId)
            .then((result) => res.json(result))
            .catch((error) => res.json({error: error}));
    }

    public getSentFeedbacks(req: Request, res: Response, next: Function) {
        this.feedbackDataController.getSentFeedbacks(req.params.userId)
            .then((result) => res.json(result))
            .catch((error) => res.json({error: error}));
    }

    public postFeedback(req: Request, res: Response, next: Function) {
        const feedback: Feedback = req.body;
        if (feedback) {
            this.feedbackDataController.saveFeedback(req.body)
                .then((result) => res.send(result))
                .catch((error: Error) => res.status(400).json(ErrorHandler.getFriendlyErrorFromMongooseError(error)));
        } else {
            res.status(400).json({error: "invalid request"});
        }
    }

    public getIncomingFeedbacks(req: Request, res: Response, next: Function) {
        this.feedbackDataController.getIncomingFeedbacks(req.params.userId)
            .then((result) => res.json(result))
            .catch((error) => res.json({error: error}));
    }
}