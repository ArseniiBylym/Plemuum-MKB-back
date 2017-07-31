
import { Express, Request, Response } from "express";
import Feedback from "../../data/models/feedback.model";
import { TYPE } from "../../data/models/feedback.model";
import FeedbackDataController from '../../data/datacontroller/feedback.datacontroller'

export default class FeedbackController {
    private feedbackDataController: FeedbackDataController;

    constructor(feedbackDataController: FeedbackDataController) {
        this.feedbackDataController = feedbackDataController;
    }

    public getFeedbacks(req: Request, res: Response, next: Function) {
        this.feedbackDataController.getAllFeedback(req.params.userId)
            .then((result) => res.json(result))
            .catch((error) => res.json({ error: error }));
    }

    public getSentFeedbacks(req: Request, res: Response, next: Function) {
        res.json(
            {
                orgId: req.params.orgId,
                userId: req.params.userId,
            }
        )
    }

    public postFeedback(req: Request, res: Response, next: Function) {
        this.saveFeedback()
            .then((result) => res.send(result))
            .catch((error) => res.json({ error: error }));
    }

    public getIncomingFeedbacks(req: Request, res: Response, next: Function) {
        res.json(
            {
                message: "incoming feedbacks"
            }
        )
    }

    public saveFeedback(): Promise<Object> {
        const feedback: Feedback = {
            senderId: "sendedID",
            recipientId: "recipientId",
            context: "context",
            message: "message",
            creationDate: "creationDate",
            privacy: ["ANONYMOUS"],
            type: "CONSIDER",
            requestId: "string",
            tags: [{
                title: "TAG title",
                isActive: true,
                order: 1
            }]
        };
        return this.feedbackDataController.saveFeedback(feedback)
    }
}