import RequestController from "../controller/request.controller";
import { Express } from "express";

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
     * @api {POST} /api/:orgId/request Create new request
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
    app.route("/api/:orgId/request")
        .post(requestController.createRequest.bind(requestController));

    /**
     * @api {GET} /api/:orgId/user/:userId/requests Get user requests
     * @apiName getRequests
     * @apiGroup Request
     * @apiHeader {String} Authorization Bearer token
     * @apiDescription Get the requests sent or received by a user
     * @apiParam {String} orgId Organization id
     * @apiParam {String} userId User unique id
     * @apiParam {Boolean} [showReplied=false] Show already replied incoming requests or not.
     *
     * @apiUse request_list_data
     */
    app.route("/api/:orgId/user/:userId/requests")
        .get(requestController.getRequests.bind(requestController));

    /**
     * @api {GET} /api/:orgId/user/:userId/requests/sender Get user's sent requests
     * @apiName getSenderRequests
     * @apiGroup Request
     * @apiHeader {String} Authorization Bearer token
     * @apiParam {String} orgId Organization id
     * @apiParam {String} userId User unique id
     * @apiDescription Get the requests sent by a user
     *
     * @apiUse request_list_data
     */
    app.route("/api/:orgId/user/:userId/requests/sender")
        .get(requestController.getSenderRequests.bind(requestController));

    /**
     * @api {GET} /api/:orgId/user/:userId/requests/recipient Get user's received requests
     * @apiName getRecipientRequests
     * @apiGroup Request
     * @apiHeader {String} Authorization Bearer token
     * @apiDescription Get the requests received by a user
     * @apiParam {String} orgId Organization id
     * @apiParam {String} userId User unique id
     * @apiParam {Boolean} [showReplied=false] Show already replied requests or not.
     *
     * @apiUse request_list_data
     */
    app.route("/api/:orgId/user/:userId/requests/recipient")
        .get(requestController.getRecipientRequests.bind(requestController));

    /**
     * @api {GET} /api/:orgId/user/:userId/requests/:requestId Get a specific request
     * @apiName getRequest
     * @apiGroup Request
     * @apiHeader {String} Authorization Bearer token
     * @apiParam {String} orgId Organization id
     * @apiParam {String} userId User unique id
     * @apiParam {String} requestId Request unique id
     *
     * @apiSuccess (Success 200) {String} senderId ID of the sender user
     * @apiSuccess (Success 200) {String[]} recipientId List of recipient user IDs
     * @apiSuccess (Success 200) {String} requestMessage Request message
     */
    app.route("/api/:orgId/user/:userId/requests/:requestId")
        .get(requestController.getRequest.bind(requestController));

    /**
     * @api {GET} /api/:orgId/user/:userId/requests/:requestId/recipients Get the recipients of a request
     * @apiName getRecipientUsersFromRequest
     * @apiGroup Request
     * @apiHeader {String} Authorization Bearer token
     * @apiParam {String} orgId Organization id
     * @apiParam {String} userId User unique id
     * @apiParam {String} requestId Request unique id
     *
     * @apiUse flat_user_list_data
     */
    app.route("/api/:orgId/user/:userId/requests/:requestId/recipients")
        .get(requestController.getRecipientUsersFromRequest.bind(requestController));

}