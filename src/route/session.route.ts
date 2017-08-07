import { Express } from "express";
import SessionController from "../controller/session.controller";
import * as passport from 'passport';

export default (app: Express, sessionController: SessionController) => {
    /**
     * @api {POST} /api/session Log-in user
     * @apiName login
     * @apiGroup Session
     * @apiDescription If the user is authenticated successfully, a Bearer token will be returned.
     * This token can be used for future requests requiring authentication, as defined in RFC6750, e.g. it can be
     * placed in the Authorization header field with the following syntax:
     *
     * Authorization: Bearer {token}
     *
     * @apiParam {String} email Email address
     * @apiParam {String} password Password
     *
     * @apiSuccess (Success 200) {String} _id User id
     * @apiSuccess (Success 200) {String} token Bearer token
     * @apiSuccess (Success 200) {String} token_expiry Expiration date of the token
     * @apiSuccess (Success 200) {Object[]} orgData Organization specific data
     * @apiSuccess (Success 200) {String} orgData.orgId ID of the organization
     * @apiSuccess (Success 200) {String} orgData.managerId ID of the user's manager
     * @apiSuccess (Success 200) {String} orgData.pictureUrl URL for the user profile picture
     */

    /**
     * @api {DELETE} /api/session Log-in user
     * @apiName logout
     * @apiGroup Session
     * @apiDescription If the user is authenticated successfully, a Bearer token will be returned.
     * This token can be used for future requests requiring authentication, as defined in RFC6750, e.g. it can be
     * placed in the Authorization header field with the following syntax:
     *
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiSuccess (Success 200) {String} message Message of success
     */
    app.route('/api/session')
        .post(passport.authenticate('local', {session: false}), sessionController.login.bind(sessionController))
        .delete(sessionController.logout.bind(sessionController));

    /**
     * @api {POST} /api/session/validtoken
     * @apiName validtoken
     * @apiGroup session
     * @apiDescription Check if the token is still valid in the reset token.
     *
     * @apiParam {String} token The token to be checked in the reset tokens
     *
     * @apiSuccess (Success 200) validToken Boolean
     */
    app.route("/api/session/validtoken")
        .post(sessionController.checkToken.bind(sessionController))
}