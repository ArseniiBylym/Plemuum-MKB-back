import { Express } from "express";
import SessionController from "../controller/session.controller";
import * as passport from 'passport';
import UserController from "../controller/user.controller";

export default (app: Express, sessionController: SessionController, userController: UserController) => {
    /**
     * @api {POST} /api/session Log-in user
     * @apiVersion 2.0.0
     * @apiName login
     * @apiGroup Session
     * @apiDescription If the user is authenticated successfully, a Bearer token will be returned.
     * This token can be used for future requests requiring authentication, as defined in RFC6750, e.g. it can be
     * placed in the Authorization header field with the following syntax: Bearer <token>
     *
     * @apiParam (Body){String} email       Email address
     * @apiParam (Body){String} password    Password
     *
     * @apiSuccess (Success 200) {String}       token Bearer    token
     * @apiSuccess (Success 200) {String}       token_expiry    Expiration date of the token
     * @apiSuccess (Success 200) {String[]}     orgIds          Array of organization IDs the user participates in
     *
     * @apiSampleRequest /api/session
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "token": "8a815f8f8ac2084c3594951368b0abc47749f28323251f293f06a902654b12502cd1feac7efde70bc123969ec5de7e52bfb809d8393b6cd5c5fcba80f1dd3761",
     *     "token_expiry": "2017-10-05T14:58:11.596Z",
     *     "orgIds": [
     *         "hipteam"
     *     ]
     * }
     */

    /**
     * @api {DELETE} /api/session Log-out user
     * @apiVersion 2.0.0
     * @apiName logout
     * @apiGroup Session
     * @apiDescription Logging out. Token will be removed, will not be available for other applications
     *
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiSuccess (Success 200) {String} message Message of success
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *         "message": "User Logged out successfully!"
     *     }
     *
     */
    app.route('/api/session')
        .post(passport.authenticate('local', {session: false}), sessionController.login.bind(sessionController))
        .delete(passport.authenticate('bearer', {session: false}), sessionController.logout.bind(sessionController));

    /**
     * @api {POST} /api/session/validtoken Valid token
     * @apiVersion 2.0.0
     * @apiName validtoken
     * @apiGroup Session
     * @apiDescription Check if the token is still valid in the reset token.
     *
     * @apiParam {String} token The token to be checked in the reset tokens
     *
     * @apiSuccess (Success 200) validToken Boolean
     * @apiSuccess (Success 200) reseted Boolean
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "validToken": true,
     *          "reseted": false
     *     }
     */
    app.route("/api/session/validtoken")
        .post(sessionController.checkToken.bind(sessionController));

    /**
     * @api {POST} /api/resetPassword Reset user's password
     * @apiVersion 2.0.0
     * @apiName resetPassword
     * @apiGroup Session
     * @apiDescription The user show intent to change his password to receive a link with a token.
     * This token has 1 day of expiration time, and after the new password being setted, it expire.
     *
     * @apiParam {String} email The user email
     *
     * @apiSuccess (Success 200) {String} email The user email
     * @apiSuccess (Success 200) {String} link The reset link of the user
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "email": "john.doe@email.com",
     *     "link": "/set_new_password?token=a8d1b49ea5df75879719e64df8d197cbaa6b6ed631764bea7381a553c1b2495d8c8198c8cb2093d40da760dcea6bd4b829b08485d87b070a19264b05310637cb&email=john.doe@email.com"
     * }
     */
    app.route("/api/resetPassword")
        .post(userController.resetPassword.bind(userController));

    /**
     * @api {POST} /api/setPassword Set new password to user
     * @apiVersion 2.0.0
     * @apiName setPassword
     * @apiGroup Session
     * @apiDescription Set the new password chosen by user to its account and generates a new token.
     *
     * @apiParam {String} token The new token for reset password
     * @apiParam {String} newPassword The new password for the user account
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "successMessage": "Your password was successfully changed. You can now go to Plenuum web app and log with new password"
     * }
     */

    app.route("/api/setPassword")
        .post(userController.setPassword.bind(userController));

    /**
     * @api {POST} /api/user/password Change user password
     * @apiVersion 2.0.0
     * @apiName changePassword
     * @apiGroup Session
     * @apiDescription Change the password of the user in side the app.
     *
     * Authorization: Bearer {token}
     *
     * @apiParam {String} email User's email
     * @apiParam {String} password User's password
     * @apiParam {String} newPassword The new desired password
     *
     * @apiSuccess (Success 200) {String} message Success message
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "message": "Password has been changed"
     * }
     */
    app.route("/api/user/password")
        .post(userController.changePassword.bind(userController));
}