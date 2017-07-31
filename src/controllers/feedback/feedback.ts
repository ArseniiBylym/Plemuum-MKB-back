
import { Express, Request, Response } from "express";
import Feedback from "../../data/models/feedback.model";
import { TYPE } from "../../data/models/feedback.model";
import { FeedbackDataController } from '../../data/datacontroller/feedback.datacontroller'

let instance: FeedbackController;

class FeedbackController {
    private feedbackDataController: FeedbackDataController;

    constructor(feedbackDataController: FeedbackDataController) {
        this.feedbackDataController = feedbackDataController;
    }

    public register(express: Express) {
        /**
         * @api {GET} /api/:orgId/user/:userId/feedbacks Get user feedbacks
         * @apiName getFeedbacks
         * @apiGroup Feedback
         * @apiHeader {String} Authorization Bearer token
         * @apiParam {String} orgId Organization id
         * @apiParam {String} userId User unique id
         * @apiDescription Get the feedbacks sent or received by a user
         *
         * @apiUse feedback_list_data
         */
        express.route("/api/:orgId/user/:userId/feedbacks")
            .get((req: Request, res: Response) => {
                res.json(
                    {
                        orgId: req.params.orgId,
                        userId: req.params.userId,
                    }
                )
            });

        /**
         * @api {GET} /api/:orgId/user/:userId/feedbacks/sent Get user's sent feedbacks
         * @apiName getSentFeedbacks
         * @apiGroup Feedback
         * @apiHeader {String} Authorization Bearer token
         * @apiParam {String} orgId Organization id
         * @apiParam {String} userId User unique id
         * @apiDescription Get the feedbacks sent by a user
         *
         * @apiUse feedback_list_data
        */
        express.route("/api/:orgId/user/:userId/feedbacks/sent")
            .get((req: Request, res: Response) => {
                res.json(
                    {
                        orgId: req.params.orgId,
                        userId: req.params.userId,
                    }
                )
            });


        /**
     * @api {POST} /api/:orgId/feedback Create new feedback
     * @apiName createFeedback
     * @apiGroup Feedback
     * @apiHeader {String} Authorization Bearer token
     * @apiParam {String} orgId Organization id
     *
     * @apiParam {String} senderId ID of the sender user
     * @apiParam {String} recipientId ID of the recipient user
     * @apiParam {String} context Context of the feedback
     * @apiParam {String} message Feedback message
     * @apiParam {String[]} [privacy] Optional privacy flags. Accepted values: PRIVATE / ANONYMOUS
     * @apiParam {String} type Type of the feedback. Accepted values: CONSIDER / CONTINUE
     * @apiParam {String} [requestId] Associated request, if applicable
     * @apiParam {Tag[]} tags array of Tag Object Associated array of tag id.
     *
     * @apiUse feedback_list_data
     */
        express.route("/api/:orgId/feedback")
            .get((req: Request, res: Response) => {
                res.json(
                    {
                        orgId: req.params.orgId,
                    }
                )
            })
            .post((req: Request, res: Response) => {
                this.handleFeedbackSave()
                    .then((result) => res.send(result))
                    .catch((error) => res.json({ error: error }));
            });
    }


    public handleFeedbackSave(): Promise<Object> {
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

const factory = (userDataController: FeedbackDataController) => {
    if (instance) {
        return instance;
    } else {
        return new FeedbackController(userDataController);
    }
};


export default factory;