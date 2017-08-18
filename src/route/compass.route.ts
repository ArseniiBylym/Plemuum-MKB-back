import CompassController from "../controller/compass.controller";
import { Express } from "express-serve-static-core";
import * as passport from 'passport';
/**
 * @apiDefine dates
 * @apiSuccess (Success 200) {String} createdAt Date of creation.
 * @apiSuccess (Success 200) {String} updatedAt Date of update.
 */
export default (app: Express, compassController: CompassController) => {
    /**
     * @api {POST} /api/:orgId/compasstodo CompassTodo for a user
     * @apiName compasstodo
     * @apiGroup Compass Assesment
     * @apiDescription Generate a todo, set of sentences about a specific user to answer.
     *
     * @apiHeader {String} Authorization Bearer token Optional for web.
     * @apiHeader {String} token Optional for Mobile.
     *
     * @apiParam {String} orgId Organization id
     * @apiParam {String} recipientId The user who the todo will be about.
     * @apiParam {String} senderId The user who ask to generate the todo.
     *
     * @apiSuccess (Success 200) {String} _id The unique identifier of the todo.
     * @apiSuccess (Success 200) {Object} aboutUser The user who the answers on the competences are for.
     * @apiSuccess (Success 200) {String} aboutUser._id The unique identifier of the user.
     * @apiSuccess (Success 200) {String} aboutUser.firstName The first name of the user of the answers are for.
     * @apiSuccess (Success 200) {String} aboutUser.lastName The last name of the user of the answers are for.
     * @apiSuccess (Success 200) {String} recipientId The unique identifier of the user who asked to answer on competences about some user.
     * @apiSuccess (Success 200) {Object} sender The user who generate the todo.
     * @apiSuccess (Success 200) {String} sender.firstName The first name of the user who generate the Todo.
     * @apiSuccess (Success 200) {String} sender.lastName The last name of the user who generate the Todo.
     * @apiSuccess (Success 200) {String} sender.pictureUrl The url of the picture of the user who generate the Todo.
     * @apiSuccess (Success 200) {String} message The message of the Todo.
     * @apiSuccess (Success 200) {Object[]} sentences The array of sentences to answer about some user.
     * @apiSuccess (Success 200) {String} sentences.message The message of a sentence to answer.
     * @apiSuccess (Success 200) {String} sentences._id The id of a sentence to answer.
     * @apiSuccess (Success 200) {String} sentences.competenceName The competence that the sentence belongs to.
     * @apiUse dates
     */
    app.route("/api/:orgId/compasstodo")
        .post(passport.authenticate('bearer', { session: false }), compassController.generateTodoController.bind(compassController));
}