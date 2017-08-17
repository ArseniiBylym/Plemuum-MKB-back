import GroupController from "../controller/group.controller";
import { Express } from "express";
import * as passport from 'passport';

export default (app: Express, groupController: GroupController) => {

    /**
     * @api {POST} /api/:orgId/groups Add new group
     * @apiName New Group
     * @apiGroup Group
     * @apiDescription Add a new groups to organization.
     *
     * @apiPermission basic
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
     * @apiVersion 2.0.0
     *
     */
    app.route('/api/:orgId/groups')
        .post(passport.authenticate('basic', {session: false}), groupController.createGroup.bind(groupController));

    /**
     * @api {GET} /api/:orgId/groups/:groupId Get a specific group by ID
     * @apiName Get Group By ID
     * @apiGroup Group
     * @apiDescription Get a specific group by ID
     *
     * @apiPermission bearer
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
     * @apiVersion 2.0.0
     */
    app.route('/api/:orgId/groups/:groupId')
        .get(passport.authenticate('bearer', {session: false}), groupController.getGroupById.bind(groupController));

    /**
     * @api {GET} /api/:orgId/groups/user/:userId Get all groups a user participates in
     * @apiName Get all groups a user participates in
     * @apiGroup Group
     * @apiDescription Get all groups a user participates in
     *
     * @apiPermission bearer
     *
     * @apiSuccess (Success 200) {Group[]} - An array of group object.
     *
     * @apiVersion 2.0.0
     *
     */
    app.route('/api/:orgId/groups/user/:userId')
        .get(passport.authenticate('bearer', {session: false}), groupController.getUserGroups.bind(groupController));

    /**
     * @api {POST} /api/:orgId/groups/:groupId/user Put a user into a group
     * @apiName Put a user into a group
     * @apiGroup Group
     * @apiDescription Put a user into a group
     *
     * @apiPermission basic
     *
     * @apiParam {String} userId User's ID.
     *
     * @apiVersion 2.0.0
     *
     */

    /**
     * @api {DELETE} /api/:orgId/groups/:groupId/user Remove a user from a group
     * @apiName Remove a user from a group
     * @apiGroup Group
     * @apiDescription Remove a user from a group
     *
     * @apiPermission basic
     *
     * @apiParam {String} userId User's ID.
     *
     * @apiVersion 2.0.0
     *
     */
    app.route('/api/:orgId/groups/:groupId/user')
        .post(passport.authenticate('basic', {session: false}), groupController.putUserIntoGroup.bind(groupController))
        .delete(passport.authenticate('basic', {session: false}), groupController.removeUserFromGroup.bind(groupController))
}