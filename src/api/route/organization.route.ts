import { Express } from "express";
import OrganizationController from "../controller/organization.controller";
import * as passport from 'passport';

export default (app: Express, organizationController: OrganizationController) => {
    /**
     * @api {POST} /api/organization Organization - Add new organization
     * @apiVersion 2.0.0
     * @apiName organization
     * @apiGroup Admin
     * @apiDescription Add a new organization to plenuum.
     *
     * @apiPermission basic
     *
     * @apiParam {String} name The name of the organization.
     * @apiParam {String} dbName The name of the database. Can not contain (' ', *, !).
     * @apiParam {Number} todoSentenceNumber The name of sentences that will be send on generated todo.
     * @apiParam {Number} compassGenerationTime Time between to COMPASS generations.
     *
     * @apiSuccess (Success 200) {String} _id Organization ID
     * @apiSuccess (Success 200) {String} name The name of the organization created.
     * @apiSuccess (Success 200) {Number} todoSentenceNumber The number of sentences to be used by the organization created.
     * @apiSuccess (Success 200) {Number} compassGenerationTime Time between to COMPASS generations.
     * @apiSuccess (Success 200) {String} dbName The database name of the organization created.
     * @apiSuccess (Success 200) {Date} createdAt The creation date of the organization created.
     * @apiSuccess (Success 200) {Date} updatedAt The update date of the organization created.
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "_id": "59cb837d78ee0108d5e68ac3"
     *     "name": "New organization",
     *     "dbName": "new_organization",
     *     "todoSentenceNumber": 3,
     *     "compassGenerationTime": 60,
     *     "createdAt": "2017-09-27T10:54:53.822Z",
     *     "updatedAt": "2017-09-27T10:54:53.822Z",
     * }
     *
     */
    app.route('/api/organization')
        .post(passport.authenticate('basic', {session: false}), organizationController.createOrganization.bind(organizationController));
}