
import { Express } from 'express';
import FeedbackController from '../controller/feedback/feedback.controller';

export default (express: Express, feedbackController: FeedbackController) => {
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
        .get(feedbackController.getFeedbacks.bind(feedbackController));

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
        .get(feedbackController.getSentFeedbacks.bind(feedbackController));

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
        .post(feedbackController.postFeedback.bind(feedbackController));
}