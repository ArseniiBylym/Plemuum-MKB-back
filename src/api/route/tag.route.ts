import TagController from "../controller/tag.controller";
import { Express } from "express";
import * as passport from "passport";
import checkAdmin from '../../middleware/admin.checker';

export default (app: Express, tagController: TagController) => {

    /**
     * @api {GET} /api/organizations/:orgId/tags List of tags
     * @apiVersion 2.0.1
     * @apiName getTags
     * @apiGroup Tag
     * @apiHeader {String} Authorization Bearer token
     * @apiParam (URL){String} orgId Organization id
     *
     * @apiSuccess (Success 200) {Tag[]} - Array of tags
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     *   [
     *       {
     *           "_id": "5989b97ddc5d02286b4dd531",
     *           "updatedAt": "2017-08-08T13:15:41.950Z",
     *           "createdAt": "2017-08-08T13:15:41.950Z",
     *           "title": "TestTitle",
     *           "isActive": true,
     *           "order": 1
     *       },
     *       {
     *           "_id": "5989ba5bdc5d02286b4dd532",
     *           "updatedAt": "2017-08-08T13:19:23.001Z",
     *           "createdAt": "2017-08-08T13:19:23.001Z",
     *           "title": "TestTitle2",
     *           "isActive": true,
     *           "order": 2
     *       },
     *
     *       ...
     *   ]
     */

    /**
     * @api {POST} /api/organizations/:orgId/tags Tag - Create a new Tag
     * @apiVersion 2.0.1
     * @apiName tag
     * @apiGroup Admin
     * @apiHeader Authorization basic
     *
     * @apiParam (URL){String} orgId Organization Id
     * @apiParam (Body){String} title Title of the tag
     *
     * @apiSuccess (Success 201) {String} _id Id of the tag
     * @apiSuccess (Success 201) {String} updatedAt Date of update in ISO Format
     * @apiSuccess (Success 201) {String} createdAt Date of creation in ISO Format
     * @apiSuccess (Success 201) {String} title The title of the tag
     * @apiSuccess (Success 201) {Boolean} isActive If the tag is active or not
     * @apiSuccess (Success 201) {Number} order The order of the tag
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 201 CREATED
     * {
     *     "_id": "59cb71c878ee0108d5e68ac1"
     *     "title": "New tag",
     *     "isActive": true,
     *     "order": 7,
     *     "createdAt": "2017-09-27T09:39:20.286Z",
     *     "updatedAt": "2017-09-27T09:39:20.286Z",
     * }
     *
     */
    app.route("/api/organizations/:orgId/tags")
        .get(passport.authenticate('jwt', {session: false}), tagController.getTags.bind(tagController))
        .post(passport.authenticate('jwt', {session: false}), checkAdmin(), tagController.addNewTag.bind(tagController));
}