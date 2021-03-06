import { Express } from "express";
import SessionController from "../controller/session.controller";
import * as passport from 'passport';
import UserController from "../controller/user.controller";

export default (app: Express, sessionController: SessionController, userController: UserController) => {
    /**
     * @api {POST} /api/session Log-in user
     * @apiVersion 2.1.0
     * @apiName login
     * @apiGroup Session
     * @apiDescription If the user is authenticated successfully, a Bearer token and a refresh token will be returned.
     * This tokens can be used for future requests requiring authentication, as defined in RFC6750, e.g. it can be
     * placed in the Authorization header field with the following syntax: Bearer <token>
     *
     * @apiParam (Body){String} email       Email address
     * @apiParam (Body){String} password    Password
     *
     * @apiSuccess (Success 200) {String}       token Bearer    token
     * @apiSuccess (Success 200) {String}       refreshToken Refresh    token
     *
     * @apiSampleRequest /api/session
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5ODQzNDIyMjdjZDM0MDM2M2RjODRjNyIsImFkbWluIjp0cnVlLCJpYXQiOjE1MDc1ODAxNjcsImV4cCI6MTUwODE4NDk2N30.slOz1lxOSfmUBIdQtagBulXkvtNrplodDdTq_fjm2zA",
     *     "refreshToken": "8j8pqGQPZJ2P6LToqPIg6IaRjAqnYHsFkhLyy5gol0oSAZhEEW6W8zRQNMDdV8jYfxKZyz2BZ0grI9h61UVNnw0NQ43zvGlIEIvDjl88uYMUnPdWN4ZltXwudBT4WetRH5JkEuWcCHOxSLTQQCYU22EDOpAEJQbW2NL6dNRwhDfpIGF7qOdYbyIuwYNgVvlLyQG7Z2LWShUhGocYKFjJsgIJMjGFovD6Cv0yuoC0uXJRnIk4XNDSqBEGzNoXhzAt"
     * }
     */

    /**
     * @api {DELETE} /api/session Log-out user
     * @apiVersion 2.0.0
     * @apiName logout
     * @apiGroup Session
     * @apiDescription Logging out. Token will be removed from the cookies. On mobile the client should remove it's token.
     */
    app.route('/api/session')
        .post(passport.authenticate('local', {session: false}), sessionController.login.bind(sessionController))
        .delete(sessionController.logout.bind(sessionController));

    /** @api {POST} /api/session/refresh-token Refresh Token
     * @apiVersion 2.1.0
     * @apiName refresh-token
     * @apiGroup Session
     * @apiHeader {String} Content-Type application/x-www-form-urlencoded
     * @apiParam (Body){String} refreshToken    Refresh Token
     * @apiDescription Refreshing token. New access token and it's refresh token will be generated and sent back to client.
     * @apiSuccess (Success 200) {String}       token Bearer    token
     * @apiSuccess (Success 200) {String}       refreshToken Refresh    token
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *           "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViYzhhMjJmMDk4MDA1NjUyM2RjMzhhNCIsImFkbWluIjpmYWxzZSwiY3JlYXRlZEF0IjoiMjAxOC0xMC0yOVQxMzozMDo1My4xMzhaIiwiZXhwaXJ5RGF0ZSI6NjA0ODAwLCJpYXQiOjE1NDA4MTk4NTMsImV4cCI6MTU0MTQyNDY1M30.YitQeej7WP4FTNVxAP1lXVC4aOi9cnLc_SFS-tlNgn0",
     *           "refreshToken": "8j8pqGQPZJ2P6LToqPIg6IaRjAqnYHsFkhLyy5gol0oSAZhEEW6W8zRQNMDdV8jYfxKZyz2BZ0grI9h61UVNnw0NQ43zvGlIEIvDjl88uYMUnPdWN4ZltXwudBT4WetRH5JkEuWcCHOxSLTQQCYU22EDOpAEJQbW2NL6dNRwhDfpIGF7qOdYbyIuwYNgVvlLyQG7Z2LWShUhGocYKFjJsgIJMjGFovD6Cv0yuoC0uXJRnIk4XNDSqBEGzNoXhzAt"
     *     }
     *
     * @apiErrorExample {json} Error-Response:
     *      HTTP/1.1 400 Bad Request
     *      HTTP/1.1 401 Unauthorized
     */
    app.route('/api/session/refresh-token')
        .post(passport.authenticate('jwtWithoutExpiryCheck', {session: false}), sessionController.refreshAccessToken.bind(sessionController));

    /**
     * @api {POST} /api/session/admin Log-in as admin
     * @apiVersion 2.0.0
     * @apiName admin-login
     * @apiGroup Session
     * @apiDescription Dedicated login endpoint for admins. If the user with the given credentials is not an admin, 403
     * Forbidden will be sent back.
     *
     * @apiParam (Body){String} email       Email address
     * @apiParam (Body){String} password    Password
     *
     * @apiSuccess (Success 200) {String}       token Bearer    token
     *
     * @apiSampleRequest /api/session
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "token": "eyJhbGciOiJIUzI1NiInR5cCI6IkpXVCJ9.eyJpZCI6IjU5ODQzNDIyMjdjZDM0MDM2M2RjODRjNyIsImFluIjpmYWxzZSwiaWF0IjoxNTA3MjEzNzU3LCJleHAiOjE1MDc4MTg1NTd9.4BfX1OyLZT1YeFZIlW_-wzlfptZhj0MvWLK54rxws",
     * }
     */
    app.route('/api/session/admin')
        .post(passport.authenticate('local', {session: false}), sessionController.loginAsAdmin.bind(sessionController));

    /**
     * @api {POST} /api/session/validtoken Valid token
     * @apiVersion 2.0.0
     * @apiName validtoken
     * @apiGroup Session
     * @apiDescription Check if the token is still valid in the reset token.
     *
     * @apiParam (Body){String} token The token to be checked in the reset tokens
     *
     * @apiSuccess (Success 200) validToken Boolean
     * @apiSuccess (Success 200) reseted Boolean
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "validToken": true,
     *          "reseted": false
     *     }
     *
     * @apiErrorExample {json} Error-Response:
     *      HTTP/1.1 511 Not Valid
     *      {
     *          "error": "Token is not valid anymore"
     *      }
     */
    app.route("/api/session/validtoken")
        .post(sessionController.checkToken.bind(sessionController));

    /**
     * @api {POST} /api/session/reset-password Reset user's password
     * @apiVersion 2.0.0
     * @apiName resetPassword
     * @apiGroup Session
     * @apiDescription The user show intent to change his password to receive a link with a token.
     * This token has 1 day of expiration time, and after the new password being setted, it expire.
     *
     * @apiParam (Body){String} email The user email
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
    app.route("/api/session/reset-password")
        .post(userController.resetPassword.bind(userController));

    /**
     * @api {POST} /api/set-password Set new password to user
     * @apiVersion 2.0.0
     * @apiName setPassword
     * @apiGroup Session
     * @apiDescription Set the new password chosen by user to its account and generates a new token.
     *
     * @apiParam (Body){String} token The new token for reset password
     * @apiParam (Body){String} newPassword The new password for the user account
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "successMessage": "Your password was successfully changed. You can now go to Plenuum web app and log with new password"
     * }
     */
    app.route("/api/session/set-password")
        .post(userController.setPassword.bind(userController));

    /**
     * @api {POST} /api/session/password Change user password
     * @apiVersion 2.0.0
     * @apiName changePassword
     * @apiGroup Session
     * @apiDescription Change the password of the user in side the app.
     *
     * Authorization: Bearer {token}
     *
     * @apiParam (Body){String} email User's email
     * @apiParam (Body){String} password User's password
     * @apiParam (Body){String} newPassword The new desired password
     *
     * @apiSuccess (Success 200) {String} message Success message
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "message": "Password has been changed"
     * }
     */
    app.route("/api/session/password")
        .post(userController.changePassword.bind(userController));
}