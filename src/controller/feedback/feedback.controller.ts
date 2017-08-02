import { Request, Response } from "express";
import Feedback from "../../data/models/feedback.model";
import FeedbackDataController from '../../data/datacontroller/feedback.datacontroller'
import BaseController from "../base.controller";

export default class FeedbackController extends BaseController {
    private feedbackDataController: FeedbackDataController;

    constructor(feedbackDataController: FeedbackDataController) {
        super();
        this.feedbackDataController = feedbackDataController;
    }

    public getFeedbacks(req: Request, res: Response,) {
        this.callController(this.feedbackDataController.getAllFeedback(req.params.userId), res, 200, 400);
    }

    public getSentFeedbacks(req: Request, res: Response,) {
        this.callController(this.feedbackDataController.getSentFeedbacks(req.params.userId), res, 200, 400);
    }

    public postFeedback(req: Request, res: Response,) {
        const feedback: Feedback = req.body;
        if (feedback) {
            this.callController(this.feedbackDataController.saveFeedback(feedback), res, 200, 400)
        } else {
            res.status(400).json({error: "invalid request"});
        }
    }

    public getIncomingFeedbacks(req: Request, res: Response,) {
        this.callController(this.feedbackDataController.getIncomingFeedbacks(req.params.userId), res, 200, 400);
    }
}