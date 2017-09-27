import TagController from "../controller/tag.controller";
import { Express } from "express";
import * as passport from "passport";

/**
 * @apiDefine tag_list_data
 * @apiSuccess (Success 200) {Tag[]} tags Id of the tag
 * @apiSuccess (Success 200) {String} _id Id of the tag
 * @apiSuccess (Success 200) {String} updatedAt Date of update in ISO Format
 * @apiSuccess (Success 200) {String} createdAt Date of creation in ISO Format
 * @apiSuccess (Success 200) {String} title The title of the tag
 * @apiSuccess (Success 200) {Boolean} isActive If the tag is active or not
 * @apiSuccess (Success 200) {Number} order The order of the tag
 */
export default (app: Express, tagController: TagController) => {

    /**
     * @api {POST} /api/:orgId/tag Create a new Tag
     * @apiVersion 2.0.0
     * @apiName tag
     * @apiGroup Tag
     * @apiHeader Authorization basic
     * @apiParam {String} orgId Organization Id
     * @apiParam {String} title Title of the tag
     *
     * @apiUse tag_list_data
     */
    app.route("/api/:orgId/tag")
        .post(passport.authenticate('basic', {session: false}), tagController.addNewTag.bind(tagController));


    /**
     * @api {GET} /api/:orgId/tags List of tags
     * @apiVersion 2.0.0
     * @apiName getTags
     * @apiGroup Tag
     * @apiHeader {String} Authorization Bearer token
     * @apiParam {String} orgId Organization id
     *
     * @apiUse tag_list_data
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *       [
     *           {
     *               "_id": "5989b97ddc5d02286b4dd531",
     *               "updatedAt": "2017-08-08T13:15:41.950Z",
     *               "createdAt": "2017-08-08T13:15:41.950Z",
     *               "title": "TestTitle",
     *               "isActive": true,
     *               "order": 1
     *           },
     *           {
     *               "_id": "5989ba5bdc5d02286b4dd532",
     *               "updatedAt": "2017-08-08T13:19:23.001Z",
     *               "createdAt": "2017-08-08T13:19:23.001Z",
     *               "title": "TestTitle2",
     *               "isActive": true,
     *               "order": 2
     *           }
     *       ]
     */

    app.route("/api/:orgId/tags")
        .get(passport.authenticate('bearer', {session: false}), tagController.getTags.bind(tagController));

}