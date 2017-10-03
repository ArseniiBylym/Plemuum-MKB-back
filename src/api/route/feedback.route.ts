import { Express } from 'express';
import FeedbackController from '../controller/feedback.controller';
import * as passport from 'passport';

/**
 * @apiDefine feedback_list_data
 * @apiSuccess (Success 200) {Object[]} feedbacks List of user feedbacks
 * @apiSuccess (Success 200) {String} feedbacks.senderId ID of the sender user
 * @apiSuccess (Success 200) {String} feedbacks.recipientId ID of the recipient user
 * @apiSuccess (Success 200) {String} feedbacks.message Feedback message
 * @apiSuccess (Success 200) {String[]="PRIVATE","ANONYMOUS"} [privacy] Optional privacy flags.
 * @apiSuccess (Success 200) {String="CONSIDER","CONTINUE"} type Type of the feedback.
 * @apiSuccess (Success 200) {String} feedbacks.createdAt Date of creation
 * @apiSuccess (Success 200) {String} feedbacks.updatedAt Date of update
 * @apiSuccess (Success 200) {String} [feedbacks.requestId] Associated request, if applicable
 * @apiSuccess (Success 200) {String[]} tags [tag] Associated tag ids of feedback
 */
export default (app: Express, feedbackController: FeedbackController) => {

    /**
     * @api {POST} /api/organizations/:orgId/feedbacks Send feedback
     * @apiVersion 2.0.1
     * @apiName createFeedback
     * @apiGroup Feedback
     * @apiHeader {String} Authorization Bearer token
     * @apiParam (URL){String} orgId Organization id
     *
     * @apiParam (Body){String} recipientId ID of the recipient user
     * @apiParam (Body){String} message Feedback message
     * @apiParam (Body){String[]="PRIVATE","ANONYMOUS"} [privacy] Optional privacy flags.
     * @apiParam (Body){String="CONSIDER","CONTINUE"} type Type of the feedback.
     * @apiParam (Body){String} [requestId] Associated request, if applicable
     * @apiParam (Body){String[]} [tags] array of Tag Object Associated array of tag id.
     *
     * @apiUse feedback_list_data
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 201 CREATED
     * {
     *     "updatedAt": "2017-09-27T09:58:16.406Z",
     *     "createdAt": "2017-09-27T09:58:16.406Z",
     *     "senderId": "5984342227cd340363dc84c7",
     *     "recipientId": "5984342227cd340363dc84a9",
     *     "message": "Message text ",
     *     "type": "CONSIDER",
     *     "_id": "59cb763878ee0108d5e68ac2",
     *     "tags": [],
     *     "privacy": []
     * }
     *
     */

    /**
     * @api {POST} /api/:orgId/feedbacks Send feedback
     * @apiVersion 2.0.0
     * @apiName createFeedback
     * @apiGroup Feedback
     * @apiHeader {String} Authorization Bearer token
     * @apiParam {String} orgId Organization id
     *
     * @apiParam {String} recipientId ID of the recipient user
     * @apiParam {String} message Feedback message
     * @apiParam {String[]="PRIVATE","ANONYMOUS"} [privacy] Optional privacy flags.
     * @apiParam {String="CONSIDER","CONTINUE"} type Type of the feedback.
     * @apiParam {String} [requestId] Associated request, if applicable
     * @apiParam {String[]} [tags] array of Tag Object Associated array of tag id.
     *
     * @apiUse feedback_list_data
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 201 CREATED
     * {
     *     "updatedAt": "2017-09-27T09:58:16.406Z",
     *     "createdAt": "2017-09-27T09:58:16.406Z",
     *     "senderId": "5984342227cd340363dc84c7",
     *     "recipientId": "5984342227cd340363dc84a9",
     *     "message": "Message text ",
     *     "type": "CONSIDER",
     *     "_id": "59cb763878ee0108d5e68ac2",
     *     "tags": [],
     *     "privacy": []
     * }
     *
     */
    app.route("/api/organizations/:orgId/feedbacks")
        .post(passport.authenticate('bearer', {session: false}), feedbackController.postFeedback.bind(feedbackController));

    /**
     * @api {GET} /api/organizations/:orgId/users/me/feedbacks Get user feedbacks
     * @apiVersion 2.0.1
     * @apiName getFeedbacks
     * @apiGroup Feedback
     * @apiHeader {String} Authorization Bearer token
     * @apiParam (URL){String} orgId Organization id
     * @apiDescription Get the feedbacks sent or received by a user
     *
     * @apiUse feedback_list_data
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     *
     * [
     *     {
     *         "_id": "59843630e7e093038ed331b5",
     *         "updatedAt": "2017-08-04T08:54:08.198Z",
     *         "createdAt": "2017-08-04T08:54:08.198Z",
     *         "senderId": "5984342227cd340363dc84c7",
     *         "recipientId": "5984342227cd340363dc84af",
     *         "message": "Chuck Norris doesn't use GUI, he prefers COMMAND line.",
     *         "type": "CONTINUE",
     *         "requestId": "",
     *         "tags": [],
     *         "privacy": []
     *     },
     *     {
     *         "_id": "59843630e7e093038ed331bb",
     *         "updatedAt": "2017-08-04T08:54:08.199Z",
     *         "createdAt": "2017-08-04T08:54:08.199Z",
     *         "senderId": "5984342227cd340363dc84c7",
     *         "recipientId": "5984342227cd340363dc84c1",
     *         "message": "Chuck Norris uses canvas in IE.",
     *         "type": "CONTINUE",
     *         "requestId": "",
     *         "tags": [],
     *         "privacy": []
     *     },
     *
     *     ...
     * ]
     *
     */

    /**
     * @api {GET} /api/:orgId/feedbacks Get user feedbacks
     * @apiVersion 2.0.0
     * @apiName getFeedbacks
     * @apiGroup Feedback
     * @apiHeader {String} Authorization Bearer token
     * @apiParam {String} orgId Organization id
     * @apiDescription Get the feedbacks sent or received by a user
     *
     * @apiUse feedback_list_data
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     *
     * [
     *     {
     *         "_id": "59843630e7e093038ed331b5",
     *         "updatedAt": "2017-08-04T08:54:08.198Z",
     *         "createdAt": "2017-08-04T08:54:08.198Z",
     *         "senderId": "5984342227cd340363dc84c7",
     *         "recipientId": "5984342227cd340363dc84af",
     *         "message": "Chuck Norris doesn't use GUI, he prefers COMMAND line.",
     *         "type": "CONTINUE",
     *         "requestId": "",
     *         "tags": [],
     *         "privacy": []
     *     },
     *     {
     *         "_id": "59843630e7e093038ed331bb",
     *         "updatedAt": "2017-08-04T08:54:08.199Z",
     *         "createdAt": "2017-08-04T08:54:08.199Z",
     *         "senderId": "5984342227cd340363dc84c7",
     *         "recipientId": "5984342227cd340363dc84c1",
     *         "message": "Chuck Norris uses canvas in IE.",
     *         "type": "CONTINUE",
     *         "requestId": "",
     *         "tags": [],
     *         "privacy": []
     *     },
     *
     *     ...
     * ]
     *
     */
    app.route("/api/organizations/:orgId/users/me/feedbacks")
        .get(passport.authenticate('bearer', {session: false}), feedbackController.getFeedbacks.bind(feedbackController));


    /**
     * @api {GET} /api/organizations/:orgId/users/me/feedbacks/sent Get user's sent feedbacks
     * @apiVersion 2.0.1
     * @apiName getSentFeedbacks
     * @apiGroup Feedback
     * @apiHeader {String} Authorization Bearer token
     * @apiParam (URL){String} orgId Organization id
     * @apiDescription Get the feedbacks sent by a user
     *
     * @apiUse feedback_list_data
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     *     {
     *         "_id": "59843630e7e093038ed331b5",
     *         "updatedAt": "2017-08-04T08:54:08.198Z",
     *         "createdAt": "2017-08-04T08:54:08.198Z",
     *         "senderId": "5984342227cd340363dc84c7",
     *         "recipientId": "5984342227cd340363dc84af",
     *         "message": "Chuck Norris doesn't use GUI, he prefers COMMAND line.",
     *         "type": "CONTINUE",
     *         "requestId": "",
     *         "tags": [],
     *         "privacy": []
     *     },
     *     {
     *         "_id": "59843630e7e093038ed331bb",
     *         "updatedAt": "2017-08-04T08:54:08.199Z",
     *         "createdAt": "2017-08-04T08:54:08.199Z",
     *         "senderId": "5984342227cd340363dc84c7",
     *         "recipientId": "5984342227cd340363dc84c1",
     *         "message": "Chuck Norris uses canvas in IE.",
     *         "type": "CONTINUE",
     *         "requestId": "",
     *         "tags": [],
     *         "privacy": []
     *     },
     *
     *     ...
     * ]
     *
     */

    /**
     * @api {GET} /api/:orgId/feedbacks/sent Get user's sent feedbacks
     * @apiVersion 2.0.0
     * @apiName getSentFeedbacks
     * @apiGroup Feedback
     * @apiHeader {String} Authorization Bearer token
     * @apiParam {String} orgId Organization id
     * @apiDescription Get the feedbacks sent by a user
     *
     * @apiUse feedback_list_data
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     *     {
     *         "_id": "59843630e7e093038ed331b5",
     *         "updatedAt": "2017-08-04T08:54:08.198Z",
     *         "createdAt": "2017-08-04T08:54:08.198Z",
     *         "senderId": "5984342227cd340363dc84c7",
     *         "recipientId": "5984342227cd340363dc84af",
     *         "message": "Chuck Norris doesn't use GUI, he prefers COMMAND line.",
     *         "type": "CONTINUE",
     *         "requestId": "",
     *         "tags": [],
     *         "privacy": []
     *     },
     *     {
     *         "_id": "59843630e7e093038ed331bb",
     *         "updatedAt": "2017-08-04T08:54:08.199Z",
     *         "createdAt": "2017-08-04T08:54:08.199Z",
     *         "senderId": "5984342227cd340363dc84c7",
     *         "recipientId": "5984342227cd340363dc84c1",
     *         "message": "Chuck Norris uses canvas in IE.",
     *         "type": "CONTINUE",
     *         "requestId": "",
     *         "tags": [],
     *         "privacy": []
     *     },
     *
     *     ...
     * ]
     *
     */
    app.route("/api/organizations/:orgId/users/me/feedbacks/sent")
        .get(passport.authenticate('bearer', {session: false}), feedbackController.getSentFeedbacks.bind(feedbackController));

    /**
     * @api {GET} /api/organizations/:orgId/users/me/feedbacks/received Get user's incoming feedbacks
     * @apiVersion 2.0.1
     * @apiName getIncomingFeedbacks
     * @apiGroup Feedback
     * @apiHeader {String} Authorization Bearer token
     * @apiParam (URL){String} orgId Organization id
     * @apiDescription Get the feedbacks received by a user
     *
     * @apiUse feedback_list_data
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     *     {
     *         "_id": "59843630e7e093038ed33179",
     *         "updatedAt": "2017-08-04T08:54:08.178Z",
     *         "createdAt": "2017-08-04T08:54:08.178Z",
     *         "senderId": "5984342227cd340363dc84be",
     *         "recipientId": "5984342227cd340363dc84c7",
     *         "message": "Chuck Norris's first program was kill -9.",
     *         "type": "CONTINUE",
     *         "requestId": "",
     *         "tags": [],
     *         "privacy": []
     *     },
     *     {
     *         "_id": "59843630e7e093038ed3317c",
     *         "updatedAt": "2017-08-04T08:54:08.180Z",
     *         "createdAt": "2017-08-04T08:54:08.180Z",
     *         "senderId": "5984342227cd340363dc84bc",
     *         "recipientId": "5984342227cd340363dc84c7",
     *         "message": "MySpace actually isn't your space, it's Chuck's (he just lets you use it).",
     *         "type": "CONTINUE",
     *         "requestId": "",
     *         "tags": [],
     *         "privacy": []
     *     },
     *
     *     ...
     * ]
     */

    /**
     * @api {GET} /api/:orgId/feedbacks/incoming Get user's incoming feedbacks
     * @apiVersion 2.0.0
     * @apiName getIncomingFeedbacks
     * @apiGroup Feedback
     * @apiHeader {String} Authorization Bearer token
     * @apiParam {String} orgId Organization id
     * @apiDescription Get the feedbacks received by a user
     *
     * @apiUse feedback_list_data
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     *     {
     *         "_id": "59843630e7e093038ed33179",
     *         "updatedAt": "2017-08-04T08:54:08.178Z",
     *         "createdAt": "2017-08-04T08:54:08.178Z",
     *         "senderId": "5984342227cd340363dc84be",
     *         "recipientId": "5984342227cd340363dc84c7",
     *         "message": "Chuck Norris's first program was kill -9.",
     *         "type": "CONTINUE",
     *         "requestId": "",
     *         "tags": [],
     *         "privacy": []
     *     },
     *     {
     *         "_id": "59843630e7e093038ed3317c",
     *         "updatedAt": "2017-08-04T08:54:08.180Z",
     *         "createdAt": "2017-08-04T08:54:08.180Z",
     *         "senderId": "5984342227cd340363dc84bc",
     *         "recipientId": "5984342227cd340363dc84c7",
     *         "message": "MySpace actually isn't your space, it's Chuck's (he just lets you use it).",
     *         "type": "CONTINUE",
     *         "requestId": "",
     *         "tags": [],
     *         "privacy": []
     *     },
     *
     *     ...
     * ]
     *
     */
    app.route("/api/organizations/:orgId/users/me/feedbacks/received")
        .get(passport.authenticate('bearer', {session: false}), feedbackController.getIncomingFeedbacks.bind(feedbackController));
}