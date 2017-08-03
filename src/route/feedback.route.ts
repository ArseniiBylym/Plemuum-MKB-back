
import { Express } from 'express';
import FeedbackController from '../controller/feedback.controller';

/**
 * @apiDefine feedback_list_data
 * @apiSuccess (Success 200) {Object[]} feedbacks List of user feedbacks
 * @apiSuccess (Success 200) {String} feedbacks.senderId ID of the sender user
 * @apiSuccess (Success 200) {String} feedbacks.recipientId ID of the recipient user
 * @apiSuccess (Success 200) {String} feedbacks.context Context of the feedback
 * @apiSuccess (Success 200) {String} feedbacks.message Feedback message
 * @apiSuccess (Success 200) {String[]} [feedbacks.privacy] Optional privacy flags. Accepted values: PRIVATE / ANONYMOUS
 * @apiSuccess (Success 200) {String} feedbacks.type Type of the feedback. Accepted values: CONSIDER / CONTINUE
 * @apiSuccess (Success 200) {String} feedbacks.createdAt Date of creation
 * @apiSuccess (Success 200) {String} feedbacks.updatedAt Date of update
 * @apiSuccess (Success 200) {String} [feedbacks.requestId] Associated request, if applicable
 * @apiSuccess (Success 200) {Tag[]} tags [tag] Associated tags of feedback
 */
export default (app: Express, feedbackController: FeedbackController) => {
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
    app.route("/api/:orgId/user/:userId/feedbacks")
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
    app.route("/api/:orgId/user/:userId/feedbacks/sent")
        .get(feedbackController.getSentFeedbacks.bind(feedbackController));

    /**
     * @api {GET} /api/:orgId/user/:userId/feedbacks/incoming Get user's received feedbacks
     * @apiName getIncomingFeedbacks
     * @apiGroup Feedback
     * @apiHeader {String} Authorization Bearer token
     * @apiParam {String} orgId Organization id
     * @apiParam {String} userId User unique id
     * @apiDescription Get the feedbacks received by a user
     *
     * @apiUse feedback_list_data
    */
    app.route("/api/:orgId/user/:userId/feedbacks/incoming")
        .get(feedbackController.getIncomingFeedbacks.bind(feedbackController));

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
    app.route("/api/:orgId/feedback")
        .post(feedbackController.postFeedback.bind(feedbackController));
}