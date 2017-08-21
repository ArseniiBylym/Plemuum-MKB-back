import { Express } from 'express';
import UserController from "../controller/user.controller";
import * as passport from 'passport';


/**
 * @apiDefine user_list_data
 * @apiSuccess (Success 200) {Object[]} users List of user profiles
 * @apiSuccess (Success 200) {String} users._id User id
 * @apiSuccess (Success 200) {String} users.firstName First name of user
 * @apiSuccess (Success 200) {String} users.lastName Last name of user
 * @apiSuccess (Success 200) {String} users.email Email address
 * @apiSuccess (Success 200) {Object[]} users.orgData Organization specific data
 * @apiSuccess (Success 200) {String} users.orgData.orgId ID of the organization
 * @apiSuccess (Success 200) {String} users.orgData.managerId ID of the user's manager
 * @apiSuccess (Success 200) {String} users.orgData.pictureUrl URL for the user profile picture
 */
export default (app: Express, userController: UserController) => {

    /**
     * @api {POST} /api/register/user Create new user
     * @apiName register
     * @apiGroup User
     *
     * @apiParam {String} firstName First name of user
     * @apiParam {String} lastName Last name of user
     * @apiParam {String} email Email address
     * @apiParam {String} orgId Organization ID
     * @apiParam {String} [managerId] ID of the user's manager
     * @apiParam {String} [pictureUrl] URL for the user profile picture
     *
     * @apiUse user_list_data
     * @apiSuccess (Success 200) {Object[]} tokens Empty list of tokens
     */
    app.route("/api/register/user")
        .get(passport.authenticate('basic', {session: false}), UserController.showRegistrationForm.bind(userController))
        .post(passport.authenticate('basic', {session: false}), userController.createNewUser.bind(userController));

    /**
     * @api {GET} /api/:orgId/users List users of organization
     * @apiName getOrgUsers
     * @apiGroup User
     * @apiHeader {String} Authorization Bearer token
     * @apiParam {String} orgId Organization id
     * @apiParam {String} [name] First or last name to filter users with
     *
     * @apiUse user_list_data
     */
    app.route("/api/:orgId/users")
        .get(passport.authenticate('bearer', {session: false}), userController.getOrganizationUsers.bind(userController));

    /**
     * @api {GET} /api/:orgId/user/:userid Get a specific user from an organization
     * @apiName getByIdFromOrg
     * @apiGroup User
     * @apiHeader {String} Authorization Bearer token
     * @apiParam {String} orgId Organization id
     * @apiParam {String} userId User unique id
     *
     * @apiSuccess (Success 200) {String} _id User id
     * @apiSuccess (Success 200) {String} firstName First name of user
     * @apiSuccess (Success 200) {String} lastName Last name of user
     * @apiSuccess (Success 200) {String} email Email address
     * @apiSuccess (Success 200) {String} managerId ID of the user's manager
     * @apiSuccess (Success 200) {String} pictureUrl URL for the user profile picture
     */
    app.route("/api/:orgId/user/:userId")
        .get(passport.authenticate('bearer', {session: false}), userController.getUserByIdFromOrganization.bind(userController));

    /**
     * @api {POST} /api/resetPassword Reset user's password
     * @apiName resetPassword
     * @apiGroup User
     * @apiDescription The user show intent to change his password to receive a link with a token.
     * This token has 1 day of expiration time, and after the new password being setted, it expire.
     *
     * @apiParam {String} email The user email
     *
     * @apiSuccess (Success 200) {String} email The user email
     * @apiSuccess (Success 200) {String} link The reset link of the user
     */
    app.route("/api/resetPassword")
        .post(userController.resetPassword.bind(userController));

    /**
     * @api {POST} /api/setPassword Set new password to user
     * @apiName setPassword
     * @apiGroup User
     * @apiDescription Set the new password chosen by user to its account and generates a new token.
     *
     * @apiParam {String} token The new token for reset password
     * @apiParam {String} newPassword The new password for the user account
     */

    app.route("/api/setPassword")
        .post(userController.setPassword.bind(userController))
        .get(UserController.showSetPasswordForm.bind(userController));

    /**
     * @api {POST} /api/user/password Change user password
     * @apiName changePassword
     * @apiGroup User
     * @apiDescription Change the password of the user in side the app.
     *
     * Authorization: Bearer {token}
     *
     * @apiParam {String} email User's email
     * @apiParam {String} password User's password
     * @apiParam {String} newPassword The new desired password
     *
     * @apiSuccess (Success 200) {String} _id User id
     * @apiSuccess (Success 200) {String} firstName First name of user
     * @apiSuccess (Success 200) {String} lastName Last name of user
     * @apiSuccess (Success 200) {String} email Email address
     * @apiSuccess (Success 200) {Object[]} orgData Organization specific data
     * @apiSuccess (Success 200) {String} orgData.orgId ID of the organization
     * @apiSuccess (Success 200) {String} orgData.managerId ID of the user's manager
     * @apiSuccess (Success 200) {String} orgData.pictureUrl URL for the user profile picture
     */
    app.route("/api/user/password")
        .post(userController.changePassword.bind(userController));

    /**
     * @api {POST} /api/profile/setpicture Change the user profile picture
     * @apiName setpicture
     * @apiGroup User
     * @apiDescription Change the profile picture which is included inside the organization data. Saves the image into firebase on plenuum/userPictures/<userId.ext>
     *
     * Authorization: Bearer {token}
     *
     * @apiParam pictureFile A file with the picture of the user.
     *
     * @apiSuccess (Success 200) {String} _id User id
     * @apiSuccess (Success 200) {String} firstName First name of user
     * @apiSuccess (Success 200) {String} lastName Last name of user
     * @apiSuccess (Success 200) {String} email Email address
     * @apiSuccess (Success 200) {Object[]} orgData Organization specific data
     * @apiSuccess (Success 200) {String} orgData.orgId ID of the organization
     * @apiSuccess (Success 200) {String} orgData.managerId ID of the user's manager
     * @apiSuccess (Success 200) {String} orgData.pictureUrl URL for the user profile picture
     */
    app.route("/api/profile/setpicture")
        .get(UserController.showPictureUploadPage.bind(userController))
        .post(passport.authenticate('bearer', {session: false}), userController.setPicture.bind(userController));
}