import { Request, Response } from "express";
import Feedback from "../data/models/feedback.model";
import BaseController from "./base.controller";
import { feedbackDataController } from "../data/datacontroller/feedback.datacontroller";

export default class FeedbackController extends BaseController {

    public getFeedbacks(req: Request, res: Response,) {
        this.callController(feedbackDataController.getAllFeedback(req.params.orgId, req.params.userId), res, 200, 400);
    }

    public getSentFeedbacks(req: Request, res: Response,) {
        this.callController(feedbackDataController.getSentFeedbacks(req.params.orgId, req.params.userId), res, 200, 400);
    }

    public postFeedback(req: Request, res: Response,) {
        const feedback: Feedback = req.body;
        if (feedback) {
            this.callController(feedbackDataController.saveFeedback(req.params.orgId, feedback), res, 200, 400)
        } else {
            res.status(400).json({error: "invalid request"});
        }
    }

    public getIncomingFeedbacks(req: Request, res: Response,) {
        this.callController(feedbackDataController.getIncomingFeedbacks(req.params.orgId, req.params.userId), res, 200, 400);
    }
}