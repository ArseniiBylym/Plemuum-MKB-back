import GroupController from "../controller/group.controller";
import { Express } from "express";
import * as passport from 'passport';

export default (app: Express, groupController: GroupController) => {
    /**
     * @api {POST} /api/:orgId/groups Add new group
     * @apiName group
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
     * @apiSuccess {String} name The name of the group.
     * @apiSuccess {String[]} [users] The participant user ids in a string array.
     * @apiSuccess {String[]} [skills] Group skill ids.
     * @apiSuccess {String[]} [answerCardRelations] Group answer card relations with other groups (group ids
     * @apiSuccess (Success 201) {Date} createdAt The creation date of the organization created.
     * @apiSuccess (Success 201) {Date} updatedAt The update date of the organization created.
     *
     * @apiError {Error} CouldNotAddDB The database could not be created due to not allowed characters or Database already exists.
     */
    app.route('/api/:orgId/groups')
        .post(passport.authenticate('basic', {session: false}), groupController.createGroup.bind(groupController));
}