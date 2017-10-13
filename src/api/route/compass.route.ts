import CompassController from "../controller/compass.controller";
import { Express } from "express-serve-static-core";
import * as passport from 'passport';
import checkAdmin from '../../middleware/admin.checker';

/**
 * @apiDefine dates
 * @apiSuccess (Success 200) {String} createdAt     Date of creation.
 * @apiSuccess (Success 200) {String} updatedAt     Date of update.
 */
export default (app: Express, compassController: CompassController) => {

    /**
     * @api {GET} /api/organizations/:orgId/interacts Interact todos
     * @apiVersion 2.0.1
     * @apiName interacts
     * @apiGroup Compass Assessment
     * @apiHeader   {String}    Authorization       Bearer token Optional for web
     *
     * @apiParam    (URL)   {String}    orgId               Organization id
     * @apiParam    (Body)  {Boolean}   [showReplied=false] Show already replied incoming requests and todos or not.
     *
     * @apiDescription Get an object of todos, which includes Feedback request and Compass Todo.
     *
     * @apiSuccess (Success 200) {Object[]} [requests] List of feedback request.
     * @apiSuccess (Success 200) {Object[]} [compassTodo] List of compass Todo.
     *
     *  @apiSuccessExample {json} Success-Response:
     *  HTTP/1.1 200 OK
     *  {
     *      "requests": [
     *           {
     *            ...
     *           },
     *           ...
     *      ],
     *      "compassTodo": [
     *           {
     *              ...
     *           },
     *           ...
     *      ]
     *  }
     */

    /**
     * @api {GET} /api/:orgId/todo Interact todos
     * @apiVersion 2.0.0
     * @apiName interacts
     * @apiGroup Compass Assessment
     * @apiHeader   {String}    Authorization       Bearer token Optional for web
     *
     * @apiParam    (URL)   {String}    orgId               Organization id
     * @apiParam    (Body)  {Boolean}   [showReplied=false] Show already replied incoming requests and todos or not.
     *
     * @apiDescription Get an object of todos, which includes Feedback request and Compass Todo.
     *
     * @apiSuccess (Success 200) {Object[]} [requests] List of feedback request.
     * @apiSuccess (Success 200) {Object[]} [compassTodo] List of compass Todo.
     *
     *  @apiSuccessExample {json} Success-Response:
     *  HTTP/1.1 200 OK
     *  {
     *      "requests": [
     *           {
     *            ...
     *           },
     *           ...
     *      ],
     *      "compassTodo": [
     *           {
     *              ...
     *           },
     *           ...
     *      ]
     *  }
     */
    app.route("/api/organizations/:orgId/interacts")
        .get(passport.authenticate('jwt', {session: false}), compassController.getTodos.bind(compassController));

    /**
     * @api {POST} /api/organizations/:orgId/compass/todos CompassTodo for a user
     * @apiVersion 2.0.1
     * @apiName compasstodo
     * @apiGroup Compass Assessment
     * @apiDescription Generate and answer card (CompassTodo).
     *
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiParam (Body) {String} aboutUserId The user who the todo will be about.
     *
     * @apiSuccess (Success 200) {String} aboutUser  The user who the answers on the competences are for.
     * @apiSuccess (Success 200) {String} ownerId    The unique identifier of the user who asked to answer on competences about some user.
     */

    /**
     * @api {POST} /api/:orgId/compasstodo CompassTodo for a user
     * @apiVersion 2.0.0
     * @apiName compasstodo
     * @apiGroup Compass Assessment
     * @apiDescription Generate and answer card (CompassTodo).
     *
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiParam (Body) {String} aboutUserId The user who the todo will be about.
     *
     * @apiSuccess (Success 200) {String} aboutUser  The user who the answers on the competences are for.
     * @apiSuccess (Success 200) {String} ownerId    The unique identifier of the user who asked to answer on competences about some user.
     */
    app.route("/api/organizations/:orgId/compass/todos")
        .post(passport.authenticate('jwt', {session: false}), compassController.answerCard.bind(compassController));

    /**
     * @api {POST} /api/organizations/:orgId/compass/answers Send CompassTodo answer
     * @apiVersion 2.0.1
     * @apiName compassanswers
     * @apiGroup Compass Assessment
     * @apiDescription ost answers based in a CompassTODO. This api will trigger an update
     * of the user statistics (No response from that must be received on the client side)
     *
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiParam (Body){String}                             compassTodo                 The unique identifier of the CompassTODO.
     * @apiParam (Body){String}                             sender                      The unique identifier of the user who answered the CompassTODO.
     * @apiParam (Body){Object[]}                           sentencesAnswer             Array of the answers for the sentences.
     * @apiParam (Body){Sentence}                           sentencesAnswer.sentence    The entire sentence object which was answered.
     * @apiParam (Body){Skill}                              sentencesAnswer.skill       The entire skill object, which under the sentence belongs.
     * @apiParam (Body){String="AGREE","DISAGREE","SKIP"}   sentencesAnswer.answer      The answer for this specific sentence.
     *
     * @apiSuccess (Success 200) {String}       _id                         The unique identifier for the answer to the CompassTODO.
     * @apiSuccess (Success 200) {String}       compassTodo                 The unique identifier of the CompassTODO.
     * @apiSuccess (Success 200) {String}       sender                      The unique identifier of the user who answered the CompassTODO.
     * @apiSuccess (Success 200) {Object[]}     sentencesAnswer             Array of the answers for the sentences.
     * @apiSuccess (Success 200) {Sentence}     sentencesAnswer.sentence    The entire sentence object which was answered.
     * @apiSuccess (Success 200) {Skill}        sentencesAnswer.skill       The entire skill object, which under the sentence belongs.
     * @apiSuccess (Success 200) {String}       sentencesAnswer.answer      The answer for this specific sentence.
     */

    /**
     * @api {POST} /api/:orgId/compassanswers Send CompassTodo answer
     * @apiVersion 2.0.0
     * @apiName compassanswers
     * @apiGroup Compass Assessment
     * @apiDescription Post answers based in a CompassTODO. This api will trigger an update
     * of the user statistics (No response from that must be received on the client side)
     *
     * @apiHeader {String} Authorization Bearer token
     *
     * @apiParam {String}                             compassTodo                 The unique identifier of the CompassTODO.
     * @apiParam {String}                             sender                      The unique identifier of the user who answered the CompassTODO.
     * @apiParam {Object[]}                           sentencesAnswer             Array of the answers for the sentences.
     * @apiParam {Sentence}                           sentencesAnswer.sentence    The entire sentence object which was answered.
     * @apiParam {Skill}                              sentencesAnswer.skill       The entire skill object, which under the sentence belongs.
     * @apiParam {String="AGREE","DISAGREE","SKIP"}   sentencesAnswer.answer      The answer for this specific sentence.
     *
     * @apiSuccess (Success 200) {String}       _id                         The unique identifier for the answer to the CompassTODO.
     * @apiSuccess (Success 200) {String}       compassTodo                 The unique identifier of the CompassTODO.
     * @apiSuccess (Success 200) {String}       sender                      The unique identifier of the user who answered the CompassTODO.
     * @apiSuccess (Success 200) {Object[]}     sentencesAnswer             Array of the answers for the sentences.
     * @apiSuccess (Success 200) {Sentence}     sentencesAnswer.sentence    The entire sentence object which was answered.
     * @apiSuccess (Success 200) {Skill}        sentencesAnswer.skill       The entire skill object, which under the sentence belongs.
     * @apiSuccess (Success 200) {String}       sentencesAnswer.answer      The answer for this specific sentence.
     */
    app.route("/api/organizations/:orgId/compass/answers")
        .post(passport.authenticate('jwt', {session: false}), compassController.answerCompass.bind(compassController));

    /**
     * @api {GET} /api/organizations/:orgId/compass/statistics Get COMPASS statistics
     * @apiVersion 2.0.1
     * @apiName CompassStatistics
     * @apiGroup Compass Assessment
     * @apiDescription Get the statistics generated from compass answers. If the user have statistics, retrieve them,
     * if not, generates the statistics only with the current competences on the organization
     *
     * @apiHeader {String} Authorization Bearer token Optional for web
     * @apiParam (URL){String} orgId Organization Id
     *
     * @apiSuccess (Success 200) {Object[]}     competencesScore
     * @apiSuccess (Success 200) {Object}       competencesScore.competence                         Competence object.
     * @apiSuccess (Success 200) {Number}       competencesScore.numberOfAnswers                    The number of answers to this competence.
     * @apiSuccess (Success 200) {Number}       competencesScore.score                              The score of answers for this competence.
     * @apiSuccess (Success 200) {Object[]}     competencesScore.sentencesScore                     Array of sentences answers for this particular competence.
     * @apiSuccess (Success 200) {Number}       competencesScore.sentencesScore.numberOfAnswers     The number of answers for this particular sentence.
     * @apiSuccess (Success 200) {Number}       competencesScore.sentencesScore.score               The score for this particular sentence.
     */

    /**
     * @api {GET} /api/:orgId/compassstatistics Get COMPASS statistics
     * @apiVersion 2.0.0
     * @apiName CompassStatistics
     * @apiGroup Compass Assessment
     * @apiHeader {String} Authorization Bearer token Optional for web
     *
     * @apiParam (URL){String} orgId Organization Id
     * @apiDescription Get the statistics generated from compass answers. If the user have statistics, retrieve them, if not, generates the statistics only with the current competences on the organization
     *
     * @apiSuccess (Success 200) {Object[]}     competencesScore
     * @apiSuccess (Success 200) {Object}       competencesScore.competence                         Competence object.
     * @apiSuccess (Success 200) {Number}       competencesScore.numberOfAnswers                    The number of answers to this competence.
     * @apiSuccess (Success 200) {Number}       competencesScore.score                              The score of answers for this competence.
     * @apiSuccess (Success 200) {Object[]}     competencesScore.sentencesScore                     Array of sentences answers for this particular competence.
     * @apiSuccess (Success 200) {Number}       competencesScore.sentencesScore.numberOfAnswers     The number of answers for this particular sentence.
     * @apiSuccess (Success 200) {Number}       competencesScore.sentencesScore.score               The score for this particular sentence.
     */
    //Just related to the user independent of the organization
    app.route("/api/organizations/:orgId/compass/statistics")
        .get(passport.authenticate('jwt', {session: false}), compassController.getStatistics.bind(compassController));

    /**
     * @api {PATCH} /api/organizations/:orgId/skills Skill - Create/Update Skill
     * @apiVersion 2.0.1
     * @apiName update skill
     * @apiGroup Admin
     * @apiDescription Update an existing skill
     *
     * @apiHeader {String} Authorization Basic username:password
     *
     * @apiParam (Body) {String}       _id                         The identifier of the skill. If this value is missing then a new skill will be created
     * @apiParam (Body) {String}       name                        The name of the skill
     * @apiParam (Body) {Sentence[]}   sentences                   Active sentences. You need to add at least one.
     * @apiParam (Body) {String}       sentences._id               Id of the sentence.
     * @apiParam (Body) {String}       sentences.message           Message of the sentence.
     * @apiParam (Body) {Sentence[]}   inactivesentences           Inactive sentences. Should be part of the object, but can be empty.
     * @apiParam (Body) {String}       inactivesentences._id       Id of the sentence.
     * @apiParam (Body) {String}       inactivesentences.message   Message of the sentence.
     *
     * @apiSuccess (Success 200) {Skill} - skill object
     */

    /**
     * @api {POST} /api/:orgId/skills Skill - Create Skill
     * @apiVersion 2.0.0
     * @apiName create skill
     * @apiGroup Admin
     * @apiDescription Create a new skill object with at least one active sentence
     *
     * @apiHeader {String} Authorization Basic username:password
     *
     * @apiParam (Body) {String}       name                The name of the skill
     * @apiParam (Body) {Sentence[]}   sentences           Active sentences. You need to add at least one.
     * @apiParam (Body) {Sentence[]}   inactivesentences   Inactive sentences. Should be part of the object, but can be empty.
     *
     * @apiSuccess (Success 200) {String}           name                The name of the skill
     * @apiSuccess (Success 200) {Sentence[]}       sentences           Active sentences. You need to add at least one.
     * @apiSuccess (Success 200) {Sentence[]}       inactivesentences   Inactive sentences. Should be part of the object, but can be empty.
     */

    /**
     * @api {PATCH} /api/:orgId/skills Skill - Update Skill
     * @apiVersion 2.0.0
     * @apiName update skill
     * @apiGroup Admin
     * @apiDescription Update an existing skill
     *
     * @apiHeader {String} Authorization Basic username:password
     *
     * @apiParam (Body) {String}       _id The identifier of the skill
     * @apiParam (Body) {String}       name The name of the skill
     * @apiParam (Body) {Sentence[]}   sentences                   Active sentences. You need to add at least one.
     * @apiParam (Body) {String}       sentences._id               Id of the sentence.
     * @apiParam (Body) {String}       sentences.message           Message of the sentence.
     * @apiParam (Body) {Sentence[]}   inactivesentences           Inactive sentences. Should be part of the object, but can be empty.
     * @apiParam (Body) {String}       inactivesentences._id       Id of the sentence.
     * @apiParam (Body) {String}       inactivesentences.message   Message of the sentence.
     *
     * @apiSuccess (Success 200) {Skill} - skill object
     */
    app.route("/api/organizations/:orgId/skills")
        .get(passport.authenticate('jwt', {session: false}), compassController.getSkills.bind(compassController))
        .patch(passport.authenticate('jwt', {session: false}), checkAdmin(), compassController.createOrUpdateSkill.bind(compassController));

    /**
     * @api {GET} /api/generatetodos Generate todos
     * @apiVersion 2.0.1
     * @apiName Generate todos
     * @apiGroup Admin
     * @apiDescription Trigger a generation of todos
     *
     * @apiHeader {String} Authorization Basic username:password
     *
     * @apiSucess (Success 200) {message} - Started
     * @apiSuccessExample {json} Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "message": "Todos were generated successfuly"
     *      }
     *
     */
    app.route("/api/generatetodos")
        .get(
            passport.authenticate('jwt', {session: false}), checkAdmin(),
            compassController.generateTodo.bind(compassController)
        );
}