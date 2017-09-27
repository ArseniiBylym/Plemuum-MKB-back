import GroupController from "../controller/group.controller";
import { Express } from "express";
import * as passport from 'passport';

export default (app: Express, groupController: GroupController) => {

    /**
     * @api {POST} /api/:orgId/groups Group - Add new group
     * @apiVersion 2.0.0
     * @apiName New Group
     * @apiGroup Admin
     * @apiDescription Add a new groups to organization.
     *
     * @apiPermission basic
     * @apiHeader {String} Authorization Basic username:password
     *
     * @apiParam {String} name The name of the group.
     * @apiParam {String[]} [users] The participant user ids in a string array.
     * @apiParam {String[]} [skills] Group skill ids.
     * @apiParam {String[]} [answerCardRelations] Group answer card relations with other groups (group ids).
     * @apiParam {String[]} [todoCardRelations] Group todo card relations with other groups (group ids).
     *
     * @apiSuccess (Success 201) {String} name The name of the group.
     * @apiSuccess (Success 201) {String[]} [users] The participant user ids in a string array.
     * @apiSuccess (Success 201) {String[]} [skills] Group skill ids.
     * @apiSuccess (Success 201) {String[]} [answerCardRelations] Group answer card relations with other groups (group ids
     * @apiSuccess (Success 201) {Date} createdAt The creation date of the organization created.
     * @apiSuccess (Success 201) {Date} updatedAt The update date of the organization created.
     *
     */

    /**
     * GET is only a dev feature to check all the groups
     */
    app.route('/api/:orgId/groups')
        .get(passport.authenticate('basic', {session: false}), groupController.getGroups.bind(groupController))
        .post(passport.authenticate('basic', {session: false}), groupController.createGroup.bind(groupController));

    /**
     * @api {GET} /api/:orgId/groups/:groupId Get a specific group by ID
     * @apiVersion 2.0.0
     * @apiName Get Group By ID
     * @apiGroup Group
     * @apiDescription Get a specific group by ID
     *
     * @apiPermission bearer
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiSuccess (Success 200) {String} name The name of the group.
     * @apiSuccess (Success 200) {String[]} [users] The participant user ids in a string array.
     * @apiSuccess (Success 200) {String[]} [skills] Group skill ids.
     * @apiSuccess (Success 200) {String[]} [answerCardRelations] Group answer card relations with other groups (group ids
     * @apiSuccess (Success 200) {Date} createdAt The creation date of the organization created.
     * @apiSuccess (Success 200) {Date} updatedAt The update date of the organization created.
     *
     * @apiError (Error 400) {Error} CouldNotFind Could not find the group by the given ID, or request was incorrect
     *
     */

    /**
     * @api {PATCH} /api/:orgId/groups/:groupId Group - Update a group
     * @apiVersion 2.0.0
     * @apiName Update a group
     * @apiGroup Admin
     * @apiDescription Update a group
     *
     * @apiPermission basic
     * @apiHeader {String} Authorization Basic username:password
     *
     * @apiParam {String} name The name of the group.
     * @apiParam {String[]} [users] The participant user ids in a string array.
     * @apiParam {String[]} [skills] Group skill ids.
     * @apiParam {String[]} [answerCardRelations] Group answer card relations with other groups (group ids).
     * @apiParam {String[]} [todoCardRelations] Group todo card relations with other groups (group ids).
     *
     * @apiError (Error 400) {Error} CouldNotFind Could not find the group by the given ID, or request was incorrect
     *
     */
    app.route('/api/:orgId/groups/:groupId')
        .get(passport.authenticate('bearer', {session: false}), groupController.getGroupById.bind(groupController))
        .patch(passport.authenticate('basic', {session: false}), groupController.updateGroup.bind(groupController));

    /**
     * @api {GET} /api/:orgId/mygroups Get all groups a user participates in
     * @apiVersion 2.0.0
     * @apiName Get all groups a user participates in
     * @apiGroup Group
     * @apiDescription Get all groups a user participates in
     *
     * @apiPermission bearer
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiSuccess (Success 200) {Group[]} - An array of group object.
     *
     */
    app.route('/api/:orgId/mygroups')
        .get(passport.authenticate('bearer', {session: false}), groupController.getUserGroups.bind(groupController));

    /**
     * @api {POST} /api/:orgId/groups/:groupId/user Group - Put a user into a group
     * @apiName Put a user into a group
     * @apiGroup Admin
     * @apiDescription Put a user into a group
     *
     * @apiPermission basic
     * @apiHeader {String} Authorization Basic username:password
     *
     * @apiParam {String} userId User's ID.
     * @apiVersion 2.0.0
     */

    /**
     * @api {DELETE} /api/:orgId/groups/:groupId/user Group - Remove a user from a group
     * @apiName Remove a user from a group
     * @apiGroup Admin
     * @apiDescription Remove a user from a group
     *
     * @apiPermission basic
     * @apiHeader {String} Authorization Basic username:password
     *
     * @apiParam {String} userId User's ID.
     * @apiVersion 2.0.0
     */
    app.route('/api/:orgId/groups/:groupId/user')
        .post(passport.authenticate('basic', {session: false}), groupController.putUserIntoGroup.bind(groupController))
        .delete(passport.authenticate('basic', {session: false}), groupController.removeUserFromGroup.bind(groupController))
}