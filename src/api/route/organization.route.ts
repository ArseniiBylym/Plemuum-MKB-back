import { Express } from "express";
import OrganizationController from "../controller/organization.controller";
import * as passport from 'passport';

export default (app: Express, organizationController: OrganizationController) => {
    /**
     * @api {POST} /api/organization Add new organization
     * @apiVersion 2.0.0
     * @apiName organization
     * @apiGroup Organization
     * @apiDescription Add a new organization to plenuum.
     *
     * @apiPermission basic
     *
     * @apiParam {String} name The name of the organization.
     * @apiParam {String} dbName The name of the database. Can not contain (' ', *, !).
     * @apiParam {Number} todoSentenceNumber The name of sentences that will be send on generated todo.
     * @apiParam {Number} compassGenerationTime Time between to COMPASS generations.
     *
     * @apiSuccess (Success 200) {String} name The name of the organization created.
     * @apiSuccess (Success 200) {Number} todoSentenceNumber The number of sentences to be used by the organization created.
     * @apiSuccess (Success 200) {String} dbName The database name of the organization created.
     * @apiSuccess (Success 200) {Date} createdAt The creation date of the organization created.
     * @apiSuccess (Success 200) {Date} updatedAt The update date of the organization created.
     *
     * @apiError {Error} CouldNotAddDB The database could not be created due to not allowed characters or Database already exists.
     */
    app.route('/api/organization')
        .post(passport.authenticate('basic', {session: false}), organizationController.createOrganization.bind(organizationController));
}