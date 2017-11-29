import RequestController from "../controller/request.controller";
import { Express } from "express";
import * as passport from 'passport';

/**
 * @apiDefine request_list_data
 * @apiSuccess (Success 200) {Object[]}     requests Array of user requests
 * @apiSuccess (Success 200) {String}       requests._id ID of the request
 * @apiSuccess (Success 200) {String}       requests.updatedAt Update date of the request
 * @apiSuccess (Success 200) {String}       requests.createdAt Creation date of the request
 * @apiSuccess (Success 200) {String}       requests.senderId ID of the sender user
 * @apiSuccess (Success 200) {String[]}     requests.recipientId Array of recipient user IDs
 * @apiSuccess (Success 200) {String}       requests.requestMessage Request message
 */
export default (app: Express, requestController: RequestController) => {

    /**
     * @api {GET} /api/organizations/:orgId/users/me/requests Get user requests
     * @apiVersion 2.0.0
     * @apiName getRequests
     * @apiGroup Request
     *
     * @apiHeader {String} Authorization Bearer token
     * @apiHeader {Boolean} [showReplied=false] Show already replied incoming requests or not. NOT IMPLEMENTED YET!
     *
     * @apiDescription Get the requests sent or received by a user
     * @apiParam (URL){String} orgId Organization id
     *
     * @apiUse request_list_data
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     *     {
     *         "_id": "59844c1cd0b5d006da3c9620",
     *         "updatedAt": "2017-08-04T10:27:40.781Z",
     *         "createdAt": "2017-08-04T10:27:40.781Z",
     *         "senderId": "5984342227cd340363dc84bd",
     *         "requestMessage": "Mock test request message",
     *         "recipientId": [
     *             "5984342227cd340363dc84bb",
     *             "5984342227cd340363dc84c7",
     *             "5984342227cd340363dc84ac"
     *         ]
     *     },
     *     {
     *         "_id": "59844c1cd0b5d006da3c9621",
     *         "updatedAt": "2017-08-04T10:27:40.781Z",
     *         "createdAt": "2017-08-04T10:27:40.781Z",
     *         "senderId": "5984342227cd340363dc84c4",
     *         "requestMessage": "Mock test request message",
     *         "recipientId": [
     *             "5984342227cd340363dc84c3",
     *             "5984342227cd340363dc84c7",
     *             "5984342227cd340363dc84c5"
     *         ]
     *     },
     *     ...
     * ]
     */

    app.route("/api/organizations/:orgId/users/me/requests")
        .get(passport.authenticate('jwt', {session: false}), requestController.getRequests.bind(requestController));

    /**
     * @api {POST} /api/organizations/:orgId/requests Send request
     * @apiVersion 2.0.0
     * @apiName createRequest
     * @apiGroup Request
     * @apiHeader {String} Authorization Bearer token
     * @apiParam (URL){String} orgId Organization id
     *
     * @apiParam (Body){String[]}   recipientId     List of recipient user IDs
     * @apiParam (Body){String}     requestMessage  Request message
     *
     * @apiSuccess (Success 201) {Object[]}     requests Array of user requests
     * @apiSuccess (Success 201) {String}       requests._id ID of the request
     * @apiSuccess (Success 201) {String}       requests.senderId ID of the sender user
     * @apiSuccess (Success 201) {String[]}     requests.recipientId List of recipient user IDs
     * @apiSuccess (Success 201) {String}       requests.requestMessage Request message
     * @apiSuccess (Success 201) {String}       requests.updatedAt Update date of the request
     * @apiSuccess (Success 201) {String}       requests.createdAt Creation date of the request
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 201 CREATED
     * {
     *     "updatedAt": "2017-09-27T11:05:12.181Z",
     *     "createdAt": "2017-09-27T11:05:12.181Z",
     *     "senderId": "5984342227cd340363dc84c7",
     *     "requestMessage": "Request message",
     *     "_id": "59cb85e878ee0108d5e68ac4",
     *     "recipientId": [
     *         "5984342227cd340363dc84af"
     *     ]
     * }
     */

    app.route("/api/organizations/:orgId/requests")
        .post(passport.authenticate('jwt', {session: false}), requestController.createRequest.bind(requestController));

    /**
     * @api {GET} /api/organizations/:orgId/users/me/requests/sent  Get user's sent requests
     * @apiVersion 2.0.0
     * @apiName getSenderRequests
     * @apiGroup Request
     * @apiHeader {String} Authorization Bearer token
     * @apiParam (URL){String} orgId Organization id
     * @apiDescription Get the requests sent by a user
     *
     * @apiUse request_list_data
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     *     {
     *         "_id": "59cb85e878ee0108d5e68ac4",
     *         "updatedAt": "2017-09-27T11:05:12.181Z",
     *         "createdAt": "2017-09-27T11:05:12.181Z",
     *         "senderId": "5984342227cd340363dc84c7",
     *         "requestMessage": "Request message",
     *         "recipientId": [
     *             "5984342227cd340363dc84af"
     *         ]
     *     },
     *     ...
     * ]
     */
    app.route("/api/organizations/:orgId/users/me/requests/sent")
        .get(passport.authenticate('jwt', {session: false}), requestController.getSenderRequests.bind(requestController));

    /**
     * @api {GET} /api/organizations/:orgId/users/me/requests/received Get user's received requests
     * @apiDeprecated Unused endpoint. Will be removed before version release.
     * @apiVersion 2.0.0
     * @apiName getRecipientRequests
     * @apiGroup Request
     *
     * @apiHeader {String} Authorization Bearer token
     * @apiHeader {Boolean} [showReplied=false] Show already replied requests or not.
     *
     * @apiDescription Get the requests received by a user
     * @apiParam (URL){String} orgId Organization id
     *
     * @apiUse request_list_data
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     *     {
     *         "_id": "59844c1cd0b5d006da3c9620",
     *         "updatedAt": "2017-08-04T10:27:40.781Z",
     *         "createdAt": "2017-08-04T10:27:40.781Z",
     *         "senderId": "5984342227cd340363dc84bd",
     *         "requestMessage": "Mock test request message",
     *         "recipientId": [
     *             "5984342227cd340363dc84bb",
     *             "5984342227cd340363dc84c7",
     *             "5984342227cd340363dc84ac"
     *         ]
     *     },
     *     {
     *         "_id": "59844c1cd0b5d006da3c9621",
     *         "updatedAt": "2017-08-04T10:27:40.781Z",
     *         "createdAt": "2017-08-04T10:27:40.781Z",
     *         "senderId": "5984342227cd340363dc84c4",
     *         "requestMessage": "Mock test request message",
     *         "recipientId": [
     *             "5984342227cd340363dc84c3",
     *             "5984342227cd340363dc84c7",
     *             "5984342227cd340363dc84c5"
     *         ]
     *     },
     *     ...
     * ]
     */

    app.route("/api/organizations/:orgId/users/me/requests/received")
        .get(passport.authenticate('jwt', {session: false}), requestController.getRecipientRequests.bind(requestController));

    /**
     * @api {GET} /api/organizations/:orgId/users/me/requests/:requestId Get a specific request
     * @apiVersion 2.0.0
     * @apiName getRequest
     * @apiGroup Request
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiParam (URL){String} orgId Organization id
     * @apiParam (URL){String} requestId Request unique id
     *
     * @apiUse request_list_data
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "_id": "59844c1cd0b5d006da3c9620",
     *     "updatedAt": "2017-08-04T10:27:40.781Z",
     *     "createdAt": "2017-08-04T10:27:40.781Z",
     *     "senderId": "5984342227cd340363dc84bd",
     *     "requestMessage": "Mock test request message",
     *     "recipientId": [
     *         "5984342227cd340363dc84bb",
     *         "5984342227cd340363dc84c7",
     *         "5984342227cd340363dc84ac"
     *     ]
     * }
     */
    app.route("/api/organizations/:orgId/users/me/requests/:requestId")
        .get(passport.authenticate('jwt', {session: false}), requestController.getRequest.bind(requestController));

    /**
     * @api {GET} /api/organizations/:orgId/users/me/requests/:requestId/recipients Get the recipients of a request
     * @apiDeprecated Unused endpoint. Will be removed before version release.
     * @apiVersion 2.0.0
     * @apiName getRecipientUsersFromRequest
     * @apiGroup Request
     * @apiHeader {String} Authorization Bearer token
     * @apiParam (URL){String} orgId Organization id
     * @apiParam (URL){String} requestId Request unique id
     *
     * @apiSuccess (Success 200) {Object[]} users Array of users
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     *     {
     *         "_id": "5984342227cd340363dc84ac",
     *         "firstName": "liam",
     *         "lastName": "harris",
     *         "email": "liam.harris@example.com",
     *         "pictureUrl": "https://randomuser.me/api/portraits/men/17.jpg",
     *         "notificationToken": [],
     *         "orgIds": [
     *             "hipteam"
     *         ]
     *     },
     *     {
     *         "_id": "5984342227cd340363dc84bb",
     *         "firstName": "amanda",
     *         "lastName": "hayes",
     *         "email": "amanda.hayes@example.com",
     *         "pictureUrl": "https://randomuser.me/api/portraits/women/28.jpg",
     *         "notificationToken": [],
     *         "orgIds": [
     *             "hipteam"
     *         ]
     *     },
     *     ...
     * ]
     *
     */
    app.route("/api/organizations/:orgId/users/me/requests/:requestId/recipients")
        .get(passport.authenticate('jwt', {session: false}), requestController.getRecipientUsersFromRequest.bind(requestController));

}