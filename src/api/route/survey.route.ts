import SurveyController from "../controller/survey.controller";
import { Express } from "express-serve-static-core";
import * as passport from 'passport';
import checkAdmin from '../../middleware/admin.checker';

export default (app: Express, surveyController: SurveyController) => {
   /**
     * @api {GET} /api/organizations/:orgId/surveys Survey - Get all surveys list
     * @apiVersion 2.0.0
     * @apiName getAllSurveys
     * @apiGroup Survey
     * @apiPermission admin
     * @apiHeader Authorization basic
     *
     * @apiParam (URL){String} orgId Organization id
     *
     * @apiSuccess (Success 200) {Survey[]} - Array of surveys
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     *   [
     *   {
     *      "_id": "5b5587187825ac2a047657b2",
     *      "updatedAt": "2018-07-23T07:43:20.853Z",
     *      "createdAt": "2018-07-23T07:43:20.853Z",
     *      "title": "survey 1",
     *      "owner": "5a84007831fdc409bc598202"
     *    },
     *    {
     *      "_id": "5b557a9982b9a800d4e2994c",
     *      "updatedAt": "2018-07-23T06:50:01.781Z",
     *      "createdAt": "2018-07-23T06:50:01.781Z",
     *      "title": "survey 2",
     *      "owner": "5a84007831fdc409bc598202"
    *    },
     *
     *       ...
     *   ]
     */

    /**
     * @api {POST} /api/organizations/:orgId/surveys Create new survey
     * @apiVersion 2.0.0
     * @apiName createSurvey
     * @apiGroup Survey
     * @apiPermission admin
     * @apiHeader {String} Authorization basic
     *
     * @apiParam (URL){String}                              orgId                 Organization id
     * @apiParam (Body){String}                             title.
     * @apiParam (Body){Object[]}                           questions             Array of the questions for the sentences.
     *
     * @apiParamExample {json} Request-Example:
     *     {
     *       "title":"New survey",
     *       "questions":[{"text":"question 1","required":true},{"text":"question 2","required":false}, ... ]
     *     }
     *
     * @apiSuccess (Success 200) {Object}                   Survey                Оbject corresponding to the newly created survey.
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *      "updatedAt": "2018-07-23T09:32:11.997Z",
     *      "createdAt": "2018-07-23T09:32:11.997Z",
     *      "title": "New survey",
     *      "owner": "5a84007831fdc409bc598202",
     *      "_id": "5b55a09b5439522754861e60"
     * }
     * 
     * @apiError Something went wrong wen create survey.
     * 
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 500 Internal server error
     *     {
     *       "error": "Something went wrong wen create survey."
     *     }
     */
    app.route("/api/organizations/:orgId/surveys")
        .get(passport.authenticate('jwt', {session: false}), surveyController.getAllSurveys.bind(surveyController))
        .post(passport.authenticate('jwt', {session: false}), surveyController.createSurvey.bind(surveyController))

    /**
     * @api {GET} /api/organizations/:orgId/surveys/:surveyId Survey - Get survey by id
     * @apiVersion 2.0.0
     * @apiName getSurveyById
     * @apiGroup Survey
     * @apiPermission admin
     * @apiHeader {String} Authorization basic
     * 
     * @apiParam (URL){String}              orgId               Organization id
     * @apiParam (URL){String}              surveyId            Survey id
     * 
     * @apiSuccess (Success 200) {Object}                   Survey                Оbject corresponding the survey model.
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *      "_id": "5b5587187825ac2a047657b2",
     *      "updatedAt": "2018-07-23T07:43:20.853Z",
     *      "createdAt": "2018-07-23T07:43:20.853Z",
     *      "title": "Some survey",
     *      "owner": "5a84007831fdc409bc598202",
     *      "questions": [
     *         {
     *             "_id": "5b5587187825ac2a047657b3",
     *             "updatedAt": "2018-07-23T07:43:20.972Z",
     *             "createdAt": "2018-07-23T07:43:20.972Z",
     *             "text": "some question 1",
     *             "required": true,
     *             "survey": "5b5587187825ac2a047657b2"
     *         },
     *         {
     *             "_id": "5b5587187825ac2a047657b4",
     *             "updatedAt": "2018-07-23T07:43:20.973Z",
     *             "createdAt": "2018-07-23T07:43:20.973Z",
     *             "text": "some question 2",
     *             "required": false,
     *             "survey": "5b5587187825ac2a047657b2"
     *         },
     *         ...
     *      ]
     * }
     * 
     * @apiError 404 Not Found.
     * 
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error": "Survey not found."
     *     }
    **/
   app.route("/api/organizations/:orgId/surveys/:surveyId")
   .get(passport.authenticate('jwt', {session: false}), surveyController.getSurvey.bind(surveyController))

    /**
     * @api {GET} /api/organizations/:orgId/questions/:questionId Questions - Get question by Id
     * @apiVersion 2.0.0
     * @apiName getQuestionById
     * @apiPermission admin
     * @apiHeader {String} Authorization basic
     * 
     * @apiParam (URL){String}              orgId               Organization id
     * @apiParam (URL){String}              questionId          Question id
     * 
     * @apiSuccess (Success 200) {Object}                   Question                Оbject corresponding the question model.
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *      "_id": "5b5587187825ac2a047657b4",
     *      "updatedAt": "2018-07-23T07:43:20.973Z",
     *      "createdAt": "2018-07-23T07:43:20.973Z",
     *      "text": "some question",
     *      "required": false,
     *      "survey": "5b5587187825ac2a047657b2"
     * }
     * 
     * @apiError 404 Not Found.
     * 
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error": "Qestion not found."
     *     }
    **/
   app.route("/api/organizations/:orgId/questions/:questionId")
   .get(passport.authenticate('jwt', {session: false}), surveyController.getQuestion.bind(surveyController))
   .patch(passport.authenticate('jwt', {session: false}), surveyController.updateQuestion.bind(surveyController))

   /**
     * @api {GET} /api/organizations/:orgId/surveysTodo Survey - Get all surveys todo list for current user
    **/
   app.route("/api/organizations/:orgId/surveysTodo")
    .get(passport.authenticate('jwt', {session: false}), surveyController.getAllSurveysTodo.bind(surveyController))

    /**
     * @api {POST} /api/organizations/:orgId/surveysTodo/:surveyTodoId Survey - Complete survey todo for current user
    **/
   app.route("/api/organizations/:orgId/surveysTodo/:surveyTodoId")
   .get(passport.authenticate('jwt', {session: false}), surveyController.getSurveyTodo.bind(surveyController))
   .patch(passport.authenticate('jwt', {session: false}), surveyController.saveSurveyTodo.bind(surveyController))

    /**
     * @api {PATCH} /api/organizations/:orgId/surveysTodo/:surveyTodoId/manager Survey TODO - Set survey to do manager
    **/
   app.route("/api/organizations/:orgId/surveysTodo/:surveyTodoId/manager")
   .patch(passport.authenticate('jwt', {session: false}), surveyController.setSurveyTodoManager.bind(surveyController))

   /**
     * @api {GET} /api/organizations/:orgId/surveys/managers Surveys - Get managers list
    **/
   app.route("/api/organizations/:orgId/surveys/search/manager")
    .get(passport.authenticate('jwt', {session: false}), surveyController.findManager.bind(surveyController))

}