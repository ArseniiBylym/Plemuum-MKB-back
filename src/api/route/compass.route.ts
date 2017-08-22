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
     * @apiHeader {String} Authorization Bearer token
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
     * @apiSuccess (Success 200) {String} recipientId The unique identifier of the user who asked to answer on
     * competences about some user.
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
        .post(passport.authenticate('bearer', {session: false}), compassController.generateTodo.bind(compassController));

    /**
     * @api {POST} /api/:orgId/compassanswers Send CompassTodo answer
     * @apiName compassanswers
     * @apiGroup Compass Assesment
     * @apiDescription ost answers based in a CompassTODO. This api will trigger an update
     * of the user statistics (No response from that must be received on the client side)
     *
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiParam {String} orgId Organization id
     * @apiParam {String} compassTodo The unique identifier of the CompassTODO.
     * @apiParam {String} sender The unique identifier of the user who answered the CompassTODO.
     * @apiParam {Object[]} sentencesAnswer Array of the answers for the sentences.
     * @apiParam {Sentence} sentencesAnswer.sentence The entire sentence object which was answered.
     * @apiParam {Skill} sentencesAnswer.skill The entire skill object, which under the sentence belongs.
     * @apiParam {String} sentencesAnswer.answer The answer for this specific sentence. Accepted values: AGREE / DISAGREE / SKIP
     *
     * @apiSuccess (Success 200) {String} _id The unique identifier for the answer to the CompassTODO.
     * @apiSuccess (Success 200) {String} compassTodo The unique identifier of the CompassTODO.
     * @apiSuccess (Success 200) {String} sender The unique identifier of the user who answered the CompassTODO.
     * @apiSuccess (Success 200) {Object[]} sentencesAnswer Array of the answers for the sentences.
     * @apiSuccess (Success 200) {Sentence} sentencesAnswer.sentence The entire sentence object which was answered.
     * @apiSuccess (Success 200) {Skill} sentencesAnswer.skill The entire skill object, which under the sentence belongs.
     * @apiSuccess (Success 200) {String} sentencesAnswer.answer The answer for this specific sentence.
     * @apiUse dates
     */
    app.route("/api/:orgId/compassanswers")
        .post(passport.authenticate('bearer', {session: false}), compassController.answerCompass.bind(compassController));
}