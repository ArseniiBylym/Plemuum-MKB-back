import RequestController from "../controller/request.controller";
import { Express } from "express";
import * as passport from 'passport';

/**
 * @apiDefine request_list_data
 * @apiSuccess (Success 200) {String} _id ID of the request
 * @apiSuccess (Success 200) {String} updatedAt Update date of the request
 * @apiSuccess (Success 200) {String} createdAt Creation date of the request
 * @apiSuccess (Success 200) {Object[]} requests List of user requests
 * @apiSuccess (Success 200) {String} requests.senderId ID of the sender user
 * @apiSuccess (Success 200) {String[]} requests.recipientId List of recipient user IDs
 * @apiSuccess (Success 200) {String} requests.requestMessage Request message
 */
export default (app: Express, requestController: RequestController) => {

    /**
     * @api {POST} /api/:orgId/requests Create new request
     * @apiVersion 2.0.0
     * @apiName createRequest
     * @apiGroup Request
     * @apiHeader {String} Authorization Bearer token
     * @apiParam {String} orgId Organization id
     *
     * @apiParam {String} senderId ID of the sender user
     * @apiParam {String[]} recipientId List of recipient user IDs
     * @apiParam {String} requestMessage Request message
     *
     * @apiUse request_list_data
     */

    /**
     * @api {GET} /api/:orgId/requests Get user requests
     * @apiVersion 2.0.0
     * @apiName getRequests
     * @apiGroup Request
     * @apiHeader {String} Authorization Bearer token
     * @apiDescription Get the requests sent or received by a user
     * @apiParam {String} orgId Organization id
     * @apiParam {Boolean} [showReplied=false] Show already replied incoming requests or not.
     *
     * @apiUse request_list_data
     */

    app.route("/api/:orgId/requests")
        .get(passport.authenticate('bearer', {session: false}), requestController.getRequests.bind(requestController))
        .post(passport.authenticate('bearer', {session: false}), requestController.createRequest.bind(requestController));

    /**
     * @api {GET} /api/:orgId/requests/sender Get user's sent requests
     * @apiVersion 2.0.0
     * @apiName getSenderRequests
     * @apiGroup Request
     * @apiHeader {String} Authorization Bearer token
     * @apiParam {String} orgId Organization id
     * @apiDescription Get the requests sent by a user
     *
     * @apiUse request_list_data
     */
    app.route("/api/:orgId/requests/sender")
        .get(passport.authenticate('bearer', {session: false}), requestController.getSenderRequests.bind(requestController));

    /**
     * @api {GET} /api/:orgId/requests/recipient Get user's received requests
     * @apiVersion 2.0.0
     * @apiName getRecipientRequests
     * @apiGroup Request
     * @apiHeader {String} Authorization Bearer token
     * @apiDescription Get the requests received by a user
     * @apiParam {String} orgId Organization id
     * @apiParam {Boolean} [showReplied=false] Show already replied requests or not.
     *
     * @apiUse request_list_data
     */
    app.route("/api/:orgId/requests/recipient")
        .get(passport.authenticate('bearer', {session: false}), requestController.getRecipientRequests.bind(requestController));

    /**
     * @api {GET} /api/:orgId/requests/:requestId Get a specific request
     * @apiVersion 2.0.0
     * @apiName getRequest
     * @apiGroup Request
     * @apiHeader {String} Authorization Bearer token
     * @apiParam {String} orgId Organization id
     * @apiParam {String} requestId Request unique id
     *
     * @apiSuccess (Success 200) {String} senderId ID of the sender user
     * @apiSuccess (Success 200) {String[]} recipientId List of recipient user IDs
     * @apiSuccess (Success 200) {String} requestMessage Request message
     */
    app.route("/api/:orgId/requests/:requestId")
        .get(passport.authenticate('bearer', {session: false}), requestController.getRequest.bind(requestController));

    /**
     * @api {GET} /api/:orgId/requests/:requestId/recipients Get the recipients of a request
     * @apiVersion 2.0.0
     * @apiName getRecipientUsersFromRequest
     * @apiGroup Request
     * @apiHeader {String} Authorization Bearer token
     * @apiParam {String} orgId Organization id
     * @apiParam {String} requestId Request unique id
     *
     */
    app.route("/api/:orgId/requests/:requestId/recipients")
        .get(passport.authenticate('bearer', {session: false}), requestController.getRecipientUsersFromRequest.bind(requestController));

}