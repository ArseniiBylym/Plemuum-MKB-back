import GroupController from "../controller/group.controller";
import { Express } from "express";
import * as passport from 'passport';
import checkAdmin from '../../middleware/admin.checker';

/**
 * @apiDefine group_entity_response
 * @apiSuccess (Success 200) {String}     _id                       Group ID.
 * @apiSuccess (Success 200) {String}     name                      The name of the group.
 * @apiSuccess (Success 200) {String[]}   [users]                   The participant user ids in a string array.
 * @apiSuccess (Success 200) {String[]}   [skills]                  Group skill ids.
 * @apiSuccess (Success 200) {String[]}   [answerCardRelations]     Group answer card relations with other groups (group ids)
 * @apiSuccess (Success 200) {String[]}   [todoCardRelations]       Group todo card relations with other groups (group ids)
 * @apiSuccess (Success 200) {Date}       createdAt                 The creation date of the organization created.
 * @apiSuccess (Success 200) {Date}       updatedAt                 The update date of the organization created.
 */

/**
 * @apiDefine group_array_response
 * @apiSuccess (Success 200) {Object[]}     groups                    Array of groups.
 * @apiSuccess (Success 200) {String}       _id                       Group ID.
 * @apiSuccess (Success 200) {String}       name                      The name of the group.
 * @apiSuccess (Success 200) {User[]}       [users]                   The participant users in an array.
 * @apiSuccess (Success 200) {Skill[]}      [skills]                  Group skills.
 * @apiSuccess (Success 200) {String[]}     [answerCardRelations]     Group answer card relations with other groups (group ids)
 * @apiSuccess (Success 200) {String[]}     [todoCardRelations]       Group todo card relations with other groups (group ids)
 * @apiSuccess (Success 200) {Date}         createdAt                 The creation date of the organization created.
 * @apiSuccess (Success 200) {Date}         updatedAt                 The update date of the organization created.
 *
 */

export default (app: Express, groupController: GroupController) => {

    /**
     * @api {POST} /api/organizations/:orgId/groups Group - Create group
     * @apiVersion 2.0.1
     * @apiName New Group
     * @apiGroup Admin
     * @apiPermission admin
     * @apiDescription Add a new groups to organization.
     *
     * @apiHeader {String} Authorization Basic username:password
     *
     * @apiParam {String}                           name The name of the group.
     * @apiParam {String[]} [users]                 The participant user ids in a string array.
     * @apiParam {String[]} [skills]                Group skill ids.
     * @apiParam {String[]} [answerCardRelations]   Group answer card relations with other groups (group ids).
     * @apiParam {String[]} [todoCardRelations]     Group todo card relations with other groups (group ids).
     *
     * @apiSuccess (Success 201) {String}    _id                     Group ID.
     * @apiSuccess (Success 201) {String}    name                    The name of the group.
     * @apiSuccess (Success 201) {String[]} [users]                 The participant user ids in a string array.
     * @apiSuccess (Success 201) {String[]} [skills]                Group skill ids.
     * @apiSuccess (Success 201) {String[]} [answerCardRelations]   Group answer card relations with other groups (group ids)
     * @apiSuccess (Success 201) {String[]} [todoCardRelations]     Group todo card relations with other groups (group ids)
     * @apiSuccess (Success 201) {Date}     createdAt               The creation date of the organization created.
     * @apiSuccess (Success 201) {Date}     updatedAt               The update date of the organization created.
     *
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 201 CREATED
     * {
     *     "updatedAt": "2017-09-27T11:35:03.590Z",
     *     "createdAt": "2017-09-27T11:35:03.590Z",
     *     "name": "Group name",
     *     "_id": "59cb8ce778ee0108d5e68ac5",
     *     "skills": [],
     *     "todoCardRelations": [],
     *     "answerCardRelations": [],
     *     "users": []
     * }
     */

    /**
     * @api {GET} /api/organizations/:orgId/groups Group - Get organization groups
     * @apiVersion 2.0.1
     * @apiName get groups
     * @apiGroup Admin
     * @apiPermission admin
     * @apiDescription Get all organization group
     *
     * @apiHeader {String} Authorization Basic username:password
     *
     * @apiUse group_array_response
     */

    /**
     * @api {PATCH} /api/organizations/:orgId/groups Group - Update a group
     * @apiVersion 2.0.1
     * @apiName Update a group
     * @apiGroup Admin
     * @apiPermission admin
     * @apiDescription Update a group
     *
     * @apiHeader {String} Authorization Basic username:password
     *
     * @apiParam (Body){String}   _id                     Group ID
     * @apiParam (Body){String}   name                    The name of the group.
     * @apiParam (Body){String[]} [users]                 The participant user ids in a string array.
     * @apiParam (Body){String[]} [skills]                Group skill ids.
     * @apiParam (Body){String[]} [answerCardRelations]   Group answer card relations with other groups (group ids).
     * @apiParam (Body){String[]} [todoCardRelations]     Group todo card relations with other groups (group ids).
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "success": "Group has been updated"
     * }
     */
    app.route('/api/organizations/:orgId/groups')
        .get(passport.authenticate('jwt', {session: false}), checkAdmin(), groupController.getGroups.bind(groupController))
        .post(passport.authenticate('jwt', {session: false}), checkAdmin(), groupController.createGroup.bind(groupController))
        .patch(passport.authenticate('jwt', {session: false}), checkAdmin(), groupController.updateGroup.bind(groupController));

    /**
     * @api {GET} /api/organizations/:orgId/groups/:groupId Get a specific group by ID
     * @apiVersion 2.0.1
     * @apiName Get Group By ID
     * @apiGroup Group
     * @apiDescription Get a specific group by ID
     *
     * @apiPermission bearer
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiParam (URL){String} orgId    Organization ID
     * @apiParam (URL){String} groupId  Group ID
     *
     * @apiUse group_entity_response
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "_id": "599312971b31d008b6bd2781",
     *     "updatedAt": "2017-09-26T11:27:45.314Z",
     *     "createdAt": "2017-09-26T11:27:45.314Z",
     *     "name": "Developers",
     *     "skills": [
     *         "5940f6044d0d550007d863df",
     *         "5940f5f44d0d550007d863dc"
     *     ],
     *     "todoCardRelations": [],
     *     "answerCardRelations": [
     *         "599312a31b31d008b6bd2782",
     *         "599312971b31d008b6bd2781"
     *     ],
     *     "users": [
     *         "5984342227cd340363dc84af",
     *         "5984342227cd340363dc84c6",
     *         "5984342227cd340363dc84c7"
     *     ]
     * }
     */
    app.route('/api/organizations/:orgId/groups/:groupId')
        .get(passport.authenticate('jwt', {session: false}), groupController.getGroupById.bind(groupController));

    /**
     * @api {GET} /api/organizations/:orgId/users/me/groups Get all groups a user participates in
     * @apiVersion 2.0.1
     * @apiName Get all groups a user participates in
     * @apiGroup Group
     * @apiDescription Get all groups a user participates in
     *
     * @apiPermission bearer
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiParam (URL){String} orgId    Organization ID
     *
     * @apiUse group_array_response
     *
     *  @apiSuccessExample {json} Success-Response:
     *  HTTP/1.1 200 OK
     *  [
     *      {
     *          "_id": "599312971b31d008b6bd2781",
     *          "updatedAt": "2017-09-26T11:27:45.314Z",
     *          "createdAt": "2017-09-26T11:27:45.314Z",
     *          "name": "Developers",
     *          "skills": [
     *              "5940f6044d0d550007d863df",
     *              "5940f5f44d0d550007d863dc"
     *          ],
     *          "todoCardRelations": [],
     *          "answerCardRelations": [
     *              "599312a31b31d008b6bd2782",
     *              "599312971b31d008b6bd2781"
     *          ],
     *          "users": [
     *              "5984342227cd340363dc84af",
     *              "5984342227cd340363dc84c6",
     *              "5984342227cd340363dc84c7"
     *          ]
     *      },
     *      ...
     *  ]
     */

    app.route('/api/organizations/:orgId/users/me/groups')
        .get(passport.authenticate('jwt', {session: false}), groupController.getUserGroups.bind(groupController));

    /**
     * @api {GET} /api/organizations/:orgId/users/me/groups/answer-card-users Get user list for answer card
     * @apiVersion 2.0.1
     * @apiName answer-card-users
     * @apiGroup Group
     *
     * @apiPermission bearer
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiParam (URL){String} orgId    Organization ID
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     *     {
     *         "_id": "5984342227cd340363dc84b2",
     *         "firstName": "wyatt",
     *         "lastName": "hunter",
     *         "email": "wyatt.hunter@example.com",
     *         "pictureUrl": "https://randomuser.me/api/portraits/men/96.jpg"
     *     },
     *     {
     *         "_id": "5984342227cd340363dc84c6",
     *         "firstName": "sebastian",
     *         "lastName": "washington",
     *         "email": "sebastian.washington@example.com",
     *         "pictureUrl": "https://randomuser.me/api/portraits/men/30.jpg"
     *     },
     *     ...
     * ]
     */
    app.route('/api/organizations/:orgId/users/me/groups/answer-card-users')
        .get(passport.authenticate('jwt', {session: false}), groupController.getAnswerCardUsers.bind(groupController));

    /**
     * @api {POST} /api/organizations/:orgId/groups/:groupId/users Group - Add user to group
     * @apiVersion 2.0.1
     * @apiName Add user to group
     * @apiGroup Admin
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization Basic username:password
     *
     * @apiParam (URL)  {String}    orgId       User ID
     * @apiParam (URL)  {String}    groupId     Group ID
     * @apiParam (Body) {String}    userId      User ID
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "success": "User has been added"
     * }
     */

    /**
     * @api {DELETE} /api/organizations/:orgId/groups/:groupId/users Group - Remove a user from a group
     * @apiVersion 2.0.1
     * @apiName Remove a user from a group
     * @apiGroup Admin
     * @apiPermission admin
     * @apiDescription Remove a user from a group
     *
     * @apiHeader {String} Authorization Basic username:password
     *
     * @apiParam (URL)  {String}    orgId       User ID
     * @apiParam (URL)  {String}    groupId     Group ID
     * @apiParam (Body) {String}    userId      User ID
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "success": "User has been removed"
     * }
     */
    app.route('/api/organizations/:orgId/groups/:groupId/users')
        .post(passport.authenticate('jwt', {session: false}), checkAdmin(), groupController.putUserIntoGroup.bind(groupController))
        .delete(passport.authenticate('jwt', {session: false}), checkAdmin(), groupController.removeUserFromGroup.bind(groupController))
}