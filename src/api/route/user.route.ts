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
     * @api {POST} /api/sendEmail/:orgId Send email from admin
     * @apiVersion 2.0.0
     * @apiName register
     * @apiGroup Admin
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization Bearer token
     *
     *  @apiParam (URL){String}              orgId                  Organization name
     *  @apiParam (Body){String[]}           respondents            Three option: [orgName], [group1Id, group2Id,..], [user1Id, user2Id,...]
     *  @apiParam (Body){String}             html                   email template ejs code
     *  @apiParam (Body){String}             subject                email subject
     * 
     * @apiParamExample {json} Request-Example:
     *    {
     *       "respondents" : ["5984342227cd340363dc84aa"],
	 *       "html":"<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'><html><head><\/head><body>    <p>Szia <%= firstName %>,<\/p>    <p>Meghívást kaptál a Plenuum használatára a(z) <span style='font-weight: bold'><\/body><\/html>",
     *       "subject": "test subject" 
     *     }
     * 
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     *    Email sending in progress     
    */

    app.route("/api/sendEmail/:orgId")
        .post(passport.authenticate('jwt', {session: false}), checkAdmin(), userController.sendEmailForUsers.bind(userController))

     /**
     * @api {GET} /api/organizations/:orgId/myTeam/users  Get my team users. If HR user get all user in org else use managerId field in user data.
     * @apiVersion 2.0.0
     * @apiName getMyTeamUsers
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
     *   {
     *   "_id": "5984342227cd340363dc84be",
     *   "firstName": "erin",
     *   "lastName": "ellis",
     *   "email": "erin.ellis@example.com",
     *   "lastActive": "1970-01-01T00:00:00.000Z",
     *   "pictureUrl": "https://randomuser.me/api/portraits/women/68.jpg",
     *   "roles": [],
     *   "managerId": "5984342227cd340363dc84c7"
     *   },
     *  {
     *   "_id": "5984342227cd340363dc84ab",
     *   "firstName": "samantha",
     *   "lastName": "clark",
     *   "email": "samantha.clark@example.com",
     *   "lastActive": "1970-01-01T00:00:00.000Z",
     *   "pictureUrl": "https://randomuser.me/api/portraits/women/15.jpg",
     *   "roles": [],
     *   "managerId": "5984342227cd340363dc84c7"
     * } ...
     * ]
     */
        
    app.route("/api/organizations/:orgId/myTeam/users")
        .get(passport.authenticate('jwt', {session: false}), userController.getMyTeamUsers.bind(userController))
    
    /**
     * @api {GET} /api/organizations/:orgId/:userId/feedbacks/excel Get user all publick feedbacks in excel file
     * @apiName getFeedbackInExcelFile
     * @apiHeader {String} Authorization basic
     * @apiGroup User
     * @apiParam (URL){String}              orgId               Organization id
     * @apiParam (URL){String}              userId              User id
     *
     *
     **/

    app.route("/api/organizations/:orgId/:userId/feedbacks/excel")
        .get(passport.authenticate('jwt', {session: false}), userController.getUserFeedbacksExcel.bind(userController))

    /**
     * @api {GET} /api/organizations/:orgId/:userId/skillScores/excel Get user skill scores in excel file
     * @apiName getFeedbackInExcelFile
     * @apiHeader {String} Authorization basic
     * @apiGroup User
     * @apiParam (URL){String}              orgId               Organization id
     * @apiParam (URL){String}              userId              User id
     *
     **/

    app.route("/api/organizations/:orgId/:userId/skillScores/excel")
        .get(passport.authenticate('jwt', {session: false}), userController.getUserSkillScoresExcel.bind(userController))

    /**
     * @api {GET} /api/organizations/:orgId/:userId/numberOfPublicFeedbacksAndSkillScores  Get number of public feedbacks and skill scores by userId
     * @apiVersion 2.0.0
     * @apiName getNumberOfFeedbacksAndSkillScores
     * @apiGroup User
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiParam (URL){String}              orgId               Organization id
     * @apiParam (URL){String}              userId              User id
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *   "numberOfpublicFeedback": 11,
     *   "numberOfSkillScores": 3
     * }
     */
        
    app.route("/api/organizations/:orgId/:userId/numberOfPublicFeedbacksAndSkillScores")
        .get(passport.authenticate('jwt', {session: false}), userController.getUserNumberOfPublicFeedbacksAndSkillScores.bind(userController))
    /**
     * @api {PATCH} /api/users/updateUserManager Update user's manager
     * @apiVersion 2.0.0
     * @apiName updateUserManager
     * @apiGroup User
     * @apiPermission user
     *
     * @apiParam (Body){String}             managerId             ManagerId
     * 
     * @apiParamExample {json} Request-Example:
     *    {
     *       "managerId": "5a84007831fdc409bc598202"
     *    }
     *
     * @apiSuccess (Success 200) {User} - Updated user object
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *  "_id": "5984342227cd340363dc84c7",
     *   "firstName": "peter",
     *   "lastName": "szabo",
     *   "email": "peter.szabo@hipteam.io",
     *   "lastActive": "2018-09-26T13:08:52.105Z",
     *   "pictureUrl": "",
     *   "roles": [
     *       ""
     *   ],  
     *   "managerId": "5a84007831fdc409bc598202",
     * }
     * 
     * * 
     * @apiError 404 Not Found.
     * 
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error": "Manager not found."
     *     }
    **/
   /**
     * @api {DELETE} /api/users/updateUserManager Unset user's manager
     * @apiVersion 2.0.0
     * @apiName updateUserManager
     * @apiGroup User
     * @apiPermission user
     * 
     * 
     * @apiSuccess (Success 200) {User} - Unset user object
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *  "_id": "5984342227cd340363dc84c7",
     *   "firstName": "peter",
     *   "lastName": "szabo",
     *   "email": "peter.szabo@hipteam.io",
     *   "lastActive": "2018-09-26T13:08:52.105Z",
     *   "pictureUrl": "",
     *   "roles": [""],  
     *   "managerId": "",
     * }
     * 
     **/

    app.route("/api/users/updateUserManager")
        .patch(passport.authenticate('jwt', {session: false}),userController.updateUserManager.bind(userController))
        .delete(passport.authenticate('jwt', {session: false}),userController.unsetUserManager.bind(userController));


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
    /**
     * @api {DELETE} /api/users User - Inactivating users
     * @apiVersion 2.0.0
     * @apiName InactiveUsers
     * @apiGroup Admin
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiParam (Body){String[]} usersId array id of deleted users
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     *      {
     *           "_id": "5984342227cd340363dc84aa",
     *           "firstName": "bill",
     *           "lastName": "cox",
     *           "email": "bill.cox@example.com",
     *           "lastActive": "2018-10-22T14:18:20.422Z",
     *           "pictureUrl": "https://randomuser.me/api/portraits/men/1.jpg",
     *           "orgId": "hipteam",
     *           "managerId": "5984342227cd340363dc84c7",
     *           "isActive": false,
     *           "lang": "hu",
     *           "roles": []
     *       }
     * ]
     */
    app.route("/api/users")
        .post(passport.authenticate('jwt', {session: false}), checkAdmin(), userController.registerUser.bind(userController))
        .patch(passport.authenticate('jwt', {session: false}), checkAdmin(), userController.modifyUser.bind(userController))
        .delete(passport.authenticate('jwt', {session: false}), checkAdmin(), userController.inactiveUsers.bind(userController));

    /**
     * @api {GET} /api/organizations/:orgId/users?query  Get organization users, query parameter ("firstNameLastName", "lastNameFirstName") sorted the result
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
        .get(passport.authenticate('jwt', {session: false}), userController.getOrganizationUsers.bind(userController))
        .post(passport.authenticate('jwt', {session: false}), checkAdmin(), userController.registerUsersFromCSV.bind(userController));
    
    /**
     * @api {GET} /api/organizations/:orgId/usersWithInactive?query  Get organization users, query parameter ("firstNameLastName", "lastNameFirstName") sorted the result
     * @apiVersion 2.0.0
     * @apiName getAllOrgUsersWithInactive
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
    app.route("/api/organizations/:orgId/usersWithInactive")
        .get(passport.authenticate('jwt', {session: false}), userController.getOrganizationUsersWithInactive.bind(userController))
        
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
     *     "orgId": "hipteam"
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