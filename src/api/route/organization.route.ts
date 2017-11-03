import { Express } from "express";
import OrganizationController from "../controller/organization.controller";
import * as passport from 'passport';
import checkAdmin from '../../middleware/admin.checker';

export default (app: Express, organizationController: OrganizationController) => {
    /**
     * @api {POST} /api/organizations Organization - Add new organization
     * @apiVersion 2.0.0
     * @apiName organization
     * @apiGroup Admin
     * @apiPermission admin
     * @apiDescription Add a new organization to plenuum.
     *
     *
     * @apiParam (Body){String} name The name of the organization.
     * @apiParam (Body){String} dbName The name of the database. Can not contain (' ', *, !).
     * @apiParam (Body){Number} todoSentenceNumber The name of sentences that will be send on generated todo.
     * @apiParam (Body){Number} compassGenerationTime Time between to COMPASS generations in milliseconds.
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

    /**
     * @api {GET} /api/organization Organization - Get organizations
     * @apiVersion 2.0.0
     * @apiName get organizations
     * @apiGroup Admin
     * @apiPermission admin
     *
     * @apiSuccess (Success 200) {Organization[]} organizations Array of organizations
     * @apiSuccess (Success 200) {String} organizations.name The name of the organization created.
     * @apiSuccess (Success 200) {Number} organizations.todoSentenceNumber The number of sentences to be used by the organization created.
     * @apiSuccess (Success 200) {Number} organizations.compassGenerationTime Time between to COMPASS generations.
     * @apiSuccess (Success 200) {String} organizations.dbName The database name of the organization created.
     * @apiSuccess (Success 200) {Date} organizations.createdAt The creation date of the organization created.
     * @apiSuccess (Success 200) {Date} organizations.updatedAt The update date of the organization created.
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     *     {
     *         "_id": "598b04c182664715590b7499",
     *         "updatedAt": "2017-10-09T12:36:55.760Z",
     *         "createdAt": "2017-10-09T12:36:55.760Z",
     *         "name": "hipteam",
     *         "dbName": "hipteam",
     *         "todoSentenceNumber": 3,
     *         "compassGenerationTime": 3
     *     },
     *     {
     *         "_id": "59db7b8b9968862ecce23612",
     *         "updatedAt": "2017-10-09T13:37:15.542Z",
     *         "createdAt": "2017-10-09T13:37:15.542Z",
     *         "name": "Super turbo ninja killers",
     *         "dbName": "super_turbo_ninja_killers",
     *         "todoSentenceNumber": 3,
     *         "compassGenerationTime": 60
     *     }
     * ]
     *
     */
    app.route('/api/organizations')
        .get(passport.authenticate('jwt', {session: false}), checkAdmin(), organizationController.getOrganizations.bind(organizationController))
        .post(passport.authenticate('jwt', {session: false}), checkAdmin(), organizationController.createOrganization.bind(organizationController))
        .patch(passport.authenticate('jwt', {session: false}), checkAdmin(), organizationController.modifyOrganization.bind(organizationController));
}