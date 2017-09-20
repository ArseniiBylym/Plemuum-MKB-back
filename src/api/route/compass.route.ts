import CompassController from "../controller/compass.controller";
import { Express } from "express-serve-static-core";
import * as passport from 'passport';

/**
 * @apiDefine dates
 * @apiSuccess (Success 200) {String} createdAt Date of creation.
 * @apiSuccess (Success 200) {String} updatedAt Date of update.
 */
export default (app: Express, compassController: CompassController) => {

    /** TODO: finish this
     * 
     * @api {POST} /api/:orgId/compasstodo CompassTodo for a user
     * @apiName compasstodo
     * @apiGroup Compass Assesment
     * @apiDescription Generate and answer card (CompassTodo).
     *
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiParam {String} aboutUserId The user who the todo will be about.
     *
     * @apiSuccess (Success 200) {String} aboutUser The user who the answers on the competences are for.
     * @apiSuccess (Success 200) {String} ownerId The unique identifier of the user who asked to answer on
     * competences about some user.
     */
    app.route("/api/:orgId/compasstodo")
        .post(passport.authenticate('bearer', {session: false}), compassController.answerCard.bind(compassController));

    /**
     * @api {POST} /api/:orgId/compassanswers Send CompassTodo answer
     * @apiName compassanswers
     * @apiGroup Compass Assesment
     * @apiDescription ost answers based in a CompassTODO. This api will trigger an update
     * of the user statistics (No response from that must be received on the client side)
     *
     * @apiHeader {String} Authorization Bearer token
     *
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
     */
    app.route("/api/:orgId/compassanswers")
        .post(passport.authenticate('bearer', {session: false}), compassController.answerCompass.bind(compassController));


    app.route("/api/create/skill/:orgId")
        .get(CompassController.createNewSkillForm);

    /**
     * @api {POST} /api/:orgId/skills Create Skill
     * @apiName create skill
     * @apiGroup Compass Assesment
     * @apiDescription Create a new skill object with at least one active sentence
     *
     * @apiHeader {String} Authorization Basic username:password
     *
     * @apiParam {String} name The name of the skill
     * @apiParam {Sentence[]} sentences Active sentences. You need to add at least one.
     * @apiParam {Sentence[]} inactivesentences Inactive sentences. Should be part of the object, but can be empty.
     *
     * @apiSuccess (Success 200) {String} name The name of the skill
     * @apiSuccess (Success 200) {Sentence[]} sentences Active sentences. You need to add at least one.
     * @apiSuccess (Success 200) {Sentence[]} inactivesentences Inactive sentences. Should be part of the object, but can be empty.
     */

    /**
     * @api {PATCH} /api/:orgId/skills Update Skill
     * @apiName create skill
     * @apiGroup Compass Assesment
     * @apiDescription Update an existing skill
     *
     * @apiHeader {String} Authorization Basic username:password
     *
     * @apiParam {String} _id The identifier of the skill
     * @apiParam {String} name The name of the skill
     * @apiParam {Sentence[]} sentences Active sentences. You need to add at least one.
     * @apiParam {String} sentences._id Id of the sentence.
     * @apiParam {String} sentences.message Message of the sentence.
     * @apiParam {Sentence[]} inactivesentences Inactive sentences. Should be part of the object, but can be empty.
     * @apiParam {String} inactivesentences._id Id of the sentence.
     * @apiParam {String} inactivesentences.message Message of the sentence.
     *
     * @apiSuccess (Success 200) {Skill} - skill object
     */
    app.route("/api/:orgId/skills")
        .get(passport.authenticate('bearer', {session: false}), compassController.getSkills.bind(compassController))
        .patch(passport.authenticate('bearer', {session: false}), compassController.updateSkill.bind(compassController))
        .post(passport.authenticate('bearer', {session: false}), compassController.createNewSkill.bind(compassController));

    /**
     * @api {GET} /api/:orgId/user/:userId/compassstatistics User Statistics
     * @apiName CompassStatistics
     * @apiGroup Compass Assesment
     * @apiHeader {String} Authorization Bearer token Optional for web
     * @apiHeader {String} token Optional for Mobile
     * @apiParam {String} orgId Organization Id
     * @apiParam {String} userId User unique id
     * @apiDescription Get the statistics generated from compass answers. If the user have statistics, retireve them, if not, generates the statistics onlye with the current competnces on the organization
     *
     * @apiSuccess (Success 200) {Object[]} competencesScore
     * @apiSuccess (Success 200) {Object} competencesScore.competence Competence object.
     * @apiSuccess (Success 200) {Number} competencesScore.numberOfAnswers The number of answers to this competence.
     * @apiSuccess (Success 200) {Number} competencesScore.score The score of answers for this competence.
     * @apiSuccess (Success 200) {Object[]} competencesScore.sentencesScore is the array of sentences answerd for this particular competence.
     * @apiSuccess (Success 200) {Object} competencesScore.sentencesScore.@apiUse sentence_object
     * @apiSuccess (Success 200) {Number} competencesScore.sentencesScore.numberOfAnswers The number of answers for this particular sentence.
     * @apiSuccess (Success 200) {Number} competencesScore.sentencesScore.score The score for this particular sentence.
     */
    //Just related to the user independent of the organization
    app.route("/api/:orgId/user/:userId/compassstatistics")
        .get(passport.authenticate('bearer', {session: false}), compassController.getStatistics.bind(compassController));
}