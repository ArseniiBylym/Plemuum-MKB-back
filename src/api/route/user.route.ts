import { Express } from 'express';
import UserController from "../controller/user.controller";
import * as passport from 'passport';
import checkAdmin from '../../middleware/admin.checker';

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
     * @api {POST} /api/users User - Create new user
     * @apiVersion 2.0.0
     * @apiName register
     * @apiGroup Admin
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiParam {String} firstName First name of user
     * @apiParam {String} lastName Last name of user
     * @apiParam {String} email Email address
     * @apiParam {String[]} orgIds Organization ID
     * @apiParam {String} [pictureUrl] URL for the user profile picture
     *
     * @apiSuccess (Success 201) {User} - Created user object
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 201 CREATED
     * {
     *     "_id": "59cb5832dccfe0061fcbec49",
     *     "firstName": "John",
     *     "lastName": "Doe",
     *     "email": "john.doe@hipteam.io",
     * }
     */

    /**
     * @api {PATCH} /api/users User - Modify existing user
     * @apiVersion 2.0.0
     * @apiName modify
     * @apiGroup Admin
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiParam (Body){String} _id User ID
     * @apiParam (Body){String} firstName First name of user
     * @apiParam (Body){String} lastName Last name of user
     * @apiParam (Body){String} email Email address
     * @apiParam (Body){String} [pictureUrl] URL for the user profile picture
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "_id": "59cb5832dccfe0061fcbec49",
     *     "firstName": "Johnny",
     *     "lastName": "Doe",
     *     "email": "john.doe@hipteam.io",
     * }
     */
    app.route("/api/users")
        .post(passport.authenticate('jwt', {session: false}), checkAdmin(), userController.createNewUser.bind(userController))
        .patch(passport.authenticate('jwt', {session: false}), checkAdmin(), userController.modifyUser.bind(userController));

    /**
     * @api {GET} /api/organizations/:orgId/users  Get organization users
     * @apiVersion 2.0.0
     * @apiName getOrgUsers
     * @apiGroup User
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiParam (URL){String} orgId Organization id
     *
     * @apiSuccess (Success 200) {User[]} - Array of users
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     *     {
     *         "_id": "5984342227cd340363dc84a9",
     *         "firstName": "christina",
     *         "lastName": "jacobs",
     *         "email": "christina.jacobs@example.com",
     *         "pictureUrl": "https://randomuser.me/api/portraits/women/74.jpg",
     *     },
     *     {
     *         "_id": "5984342227cd340363dc84aa",
     *         "firstName": "bill",
     *         "lastName": "cox",
     *         "email": "bill.cox@example.com",
     *         "pictureUrl": "https://randomuser.me/api/portraits/men/1.jpg",
     *     },
     *      ...
     * ]
     */
    app.route("/api/organizations/:orgId/users")
        .get(passport.authenticate('jwt', {session: false}), userController.getOrganizationUsers.bind(userController));

    /**
     * @api {GET} /api/organizations/:orgId/users/:userId Get a specific user from an organization
     * @apiVersion 2.0.0
     * @apiName getByIdFromOrg
     * @apiGroup User
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiParam (URL){String} orgId Organization id
     * @apiParam (URL){String} userId User unique id
     *
     * @apiSuccess (Success 200) {User} - User object
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "_id": "5984342227cd340363dc84c7",
     *     "firstName": "john",
     *     "lastName": "doe",
     *     "email": "john.doe@hipteam.io",
     *     "pictureUrl": "",
     * }
     *
     */
    app.route("/api/organizations/:orgId/users/:userId")
        .get(passport.authenticate('jwt', {session: false}), userController.getUserByIdFromOrganization.bind(userController));

    /**
     * @api {GET} /api/users/me Get user by token
     * @apiVersion 2.0.0
     * @apiName get self
     * @apiGroup User
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiSuccess (Success 200) {User} - User object
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "_id": "5984342227cd340363dc84c7",
     *     "firstName": "peter",
     *     "lastName": "szabo",
     *     "email": "peter.szabo@hipteam.io",
     *     "pictureUrl": "",
     *     "orgIds": [
     *         "hipteam"
     *     ]
     * }
     */
    app.route("/api/users/me")
        .get(passport.authenticate('jwt', {session: false}), userController.getUserByToken.bind(userController));

    /**
     * @api {POST} /api/users/me/avatar    Change the user profile picture
     * @apiVersion 2.0.0
     * @apiName setpicture
     * @apiGroup User
     * @apiDescription Change the profile picture which is included inside the organization data. Saves the image into firebase on plenuum/userPictures/<userId.ext>
     *
     * Authorization: Bearer {token}
     *
     * @apiParam (Body){File} avatar A file with the picture of the user.
     *
     * @apiSuccess (Success 200) {String} message Success message
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "avatar": "http://storage.googleapis.com/plenuumbackend.appspot.com/plenuum/userPictures/5984342227cd340363dc84c7"
     * }
     *
     */
    app.route("/api/users/me/avatar")
        .post(passport.authenticate('jwt', {session: false}), userController.setPicture.bind(userController));
}