import TagController from "../controller/tag/tag.controller";
import { Express } from "express";

/**
 * @apiDefine tag_list_data
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
     * @apiName tag
     * @apiGroup Tag
     * @apiHeader Authorization basic
     * @apiParam {String} orgId Organization Id
     * @apiParam {String} title Title of the tag
     *
     * @apiUse tag_list_data
     */
    app.route("/api/:orgId/tag")
        .get(tagController.showNewTagForm)
        .post(tagController.addNewTag);


    /**
     * @api {GET} /api/:orgId/tags List of tags
     * @apiName getTags
     * @apiGroup Tag
     * @apiHeader {String} Authorization Bearer token
     * @apiParam {String} orgId Organization id
     *
     * @apiUse tag_list_data
     */
    app.route("/api/:orgId/tags")
        .get(tagController.getTags);

}