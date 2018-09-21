import SurveyController from "../controller/survey.controller";
import { Express } from "express-serve-static-core";
import * as passport from 'passport';
import checkAdmin from '../../middleware/admin.checker';

export default (app: Express, surveyController: SurveyController) => {
//survey2 apis

/**
     * @api {GET} /api/organizations/:orgId/surveys/:surveyType  Survey2 - Get all surveys2 list for current user
     * @apiVersion 2.0.0
     * @apiName getAllSurveys2
     * @apiGroup Survey
     * @apiPermission user
     * @apiHeader Authorization basic
     *
     * @apiParam (URL){String} orgId Organization id
     * @apiParam (URL){String} surveyType kind of survey use string "2"
     * 
     * @apiSuccess (Success 200) {Survey[]} - Array of surveys
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     *   [
     *       {
     *           "_id": "5ba38c9700818d34af369411",
     *           "createdAt": "2018-09-20T12:03:35.152Z",
     *           "title": "Survey title",
     *           "expiritDate": "2018-10-22T15:51:41.696Z",
     *           "complitedSurveyTodos": 2,
     *           "allSurveyTodos": 3
     *       },
     *        ...
     *   ]
     */

    /**
     * @api {POST} /api/organizations/:orgId/surveys/:surveyType Survey2 - Create new survey2
     * @apiVersion 2.0.0
     * @apiName createSurvey2
     * @apiGroup Survey
     * @apiPermission user
     * @apiHeader {String} Authorization basic
     *
     * @apiParam (URL){String}                              orgId                 Organization id
     * @apiParam (URL){String}                              surveyType            Kind of survey use string "2"
     * @apiParam (Body){String}                             title                 Survey title
     * @apiParam (Body){String}                             description           Survey description
     * @apiParam (Body){String[]}                           respondents           Those who receive the survey. Three option: [orgName], [group1Id, group2Id,..], [user1Id, user2Id,...]
     * @apiParam (Body){Date}                               expiritDate           Survey expirit date 
     * @apiParam (Body){Object[]}                           questions             Array of the questions for the sentences. Have new field "type" string 3 option: "text", "1-6", "yes-no"
     *
     * @apiParamExample {json} Request-Example:
     *    {
     *       "title":"Survey title",
     *       "description": "This is description of survey",
     *       "respondents": ["599312a81b31d008b6bd2783"],
     *       "expiritDate": "2018-10-22 18:51:41.696",
     *       "questions":[{"type": "text" ,"text":"2+2?","required":true,"min":10,"max":0},
     *                   {"type": "text", "text":"4+4?","required":false,"min":null}, 
     *                   {"type": "1-6", "text":"How do you feel?", "required":false},
	 *   		         {"type": "yes-no", "text":"Do you like beer?", "required":true}]
     *    }
     *
     * @apiSuccess (Success 200) {Object}                   Survey                Оbject corresponding to the newly created survey.
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *      "updatedAt": "2018-09-20T12:03:35.152Z",
            "createdAt": "2018-09-20T12:03:35.152Z",
            "title": "Survey title",
            "description": "This is description of survey",
            "expiritDate": "2018-10-22T15:51:41.696Z",
            "owner": "5984342227cd340363dc84a9",
            "type": 2,
            "_id": "5ba38c9700818d34af369411",
            "respondents": [
                 "599312a81b31d008b6bd2783"
            ]
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
    app.route("/api/organizations/:orgId/surveys/:surveyType")
    .get(passport.authenticate('jwt', {session: false}), surveyController.getAllSurveysByUserId.bind(surveyController))
    .post(passport.authenticate('jwt', {session: false}), surveyController.createSurveyDynamic.bind(surveyController))

    /**
     * @api {GET} /api/organizations/:orgId/survey/:surveyType/:surveyId/excel Survey2 - Get all answers by surveyId in excel file
     * @apiName getAllSurveysTodo
     * @apiHeader {String} Authorization basic
     * @apiGroup Survey
     * @apiParam (URL){String}              orgId               Organization id
     * @apiParam (URL){String}              surveyId            Survey id
     * @apiParam (URL){String}              surveyType          Kind of survey use string "2"
     *
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * Downloaded {survey.title}.xlsx file 
     *
     *
     **/

    app.route("/api/organizations/:orgId/survey/:surveyType/:surveyId/excel")
        .get(passport.authenticate('jwt', {session: false}), surveyController.getAllAnswersSurveyById.bind(surveyController));

    /**
     * @api {GET} /api/organizations/:orgId/survey/:surveyType/:surveyId/detail  Survey2 - Get survey2 detail
     * @apiVersion 2.0.0
     * @apiName getSurveyDetailById
     * @apiGroup Survey
     * @apiPermission user
     * @apiHeader {String} Authorization basic
     * 
     * @apiParam (URL){String}              orgId               Organization id
     * @apiParam (URL){String}              surveyType          Kind of survey use string "2"
     * @apiParam (URL){String}              surveyId            Survey id
     * 
     * @apiSuccess (Success 200) {Object}                   Survey                Оbject corresponding the survey model.
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     ** {
     *       "_id": "5ba4a721f3722f1f9fc84347",
     *       "updatedAt": "2018-09-21T08:09:05.266Z",
     *       "createdAt": "2018-09-21T08:09:05.266Z",
     *       "title": "Survey 2",
     *       "description": "This is description of survey",
     *       "expiritDate": "2018-10-22T15:51:41.696Z",
     *       "type": 2,
     *       "respondents": [
     *           {
     *               "name": "christina",
     *               "imgUrl": "https://randomuser.me/api/portraits/women/74.jpg"
     *           },
     *           {
     *               "name": "bill",
     *               "imgUrl": "https://randomuser.me/api/portraits/men/1.jpg"
     *           },
     *           {
     *               "name": "samantha",
     *               "imgUrl": "https://randomuser.me/api/portraits/women/15.jpg"
     *           },
     *           {
     *               "name": "liam",
     *               "imgUrl": "https://randomuser.me/api/portraits/men/17.jpg"
     *           },...
     *           
     *       ],
     *       "questions": [
     *           {
     *               "_id": "5ba4a721f3722f1f9fc84348",
     *               "updatedAt": "2018-09-21T08:09:05.285Z",
     *               "createdAt": "2018-09-21T08:09:05.285Z",
     *               "type": "text",
     *               "text": "2+2",
     *               "survey": "5ba4a721f3722f1f9fc84347",
     *               "max": 500,
     *               "min": 10,
     *               "required": true,
     *               "answerValues": []
     *           }, ...
     *       ],
     *       "complitedSurveyTodos": 0,
     *       "allSurveyTodos": 3
     *   }
     * 
     * @apiError 404 Not Found.
     * 
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error": "Survey not found."
     *     }
    **/

    app.route("/api/organizations/:orgId/survey/:surveyType/:surveyId/detail")
        .get(passport.authenticate('jwt', {session: false}), surveyController.getSurveyDetail.bind(surveyController));
    

        //end survey2 apis
   /**
     * @api {GET} /api/organizations/:orgId/surveys  Get all surveys list
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
     * @apiParam (Body){String}                             title                 Survey title
     * @apiParam (Body){Object[]}                           questions             Array of the questions for the sentences.
     *
     * @apiParamExample {json} Request-Example:
     *     {
     *       "title":"New survey",
     *       "questions":[
     *                  {
     *                    "text":"question 1",
     *                    "required":true,
     *                    "min": 1,
     *                    "max": 60
     *                  },
     *                  {
     *                    "text":"question 2",
     *                    "required":false,
     *                    "min": null,
     *                    "max": 200
     *                  },
     *                   ... ]
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
        .get(passport.authenticate('jwt', {session: false}), checkAdmin(), surveyController.getAllSurveys.bind(surveyController))
        .post(passport.authenticate('jwt', {session: false}), checkAdmin(), surveyController.createSurvey.bind(surveyController))

    /**
     * @api {GET} /api/organizations/:orgId/surveys/:surveyId  Get survey by id
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
     *             "min": 0,
     *             "max": 125,
     *             "survey": "5b5587187825ac2a047657b2"
     *         },
     *         {
     *             "_id": "5b5587187825ac2a047657b4",
     *             "updatedAt": "2018-07-23T07:43:20.973Z",
     *             "createdAt": "2018-07-23T07:43:20.973Z",
     *             "text": "some question 2",
     *             "required": false,
     *             "min": 0,
     *             "max": 150,
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
   .get(passport.authenticate('jwt', {session: false}), checkAdmin(), surveyController.getSurvey.bind(surveyController))

    /**
     * @api {GET} /api/organizations/:orgId/questions/:questionId Questions - Get question by Id
     * @apiVersion 2.0.0
     * @apiName getQuestionById
     * @apiGroup Survey
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
     *      "required": true,
     *      "min": 10,
     *      "max": 125,
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

    /**
     * @api {PATCH} /api/organizations/:orgId/questions/:questionId Update survey question by Id
     * @apiName updateSurveyQuestion
     * @apiPermission admin
     * @apiHeader {String} Authorization basic
     * @apiGroup Survey
     * 
     * @apiParam (URL){String}              orgId               Organization id
     * @apiParam (URL){String}              questionId          Question id
     * @apiParam (Body){String}             text                Question text
     * @apiParam (Body){Boolean}            required            Indicate mandatory field
     * @apiParam (Body){Number}             max                 max character number
     * @apiParam (Body){Number}             min                 min character number
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *    "_id": "5b55c9885bcca52fbce8a781",
     *    "updatedAt": "2018-07-23T15:07:23.029Z",
     *    "createdAt": "2018-07-23T12:26:48.984Z",
     *    "text": "test-min-max-patch",
     *    "survey": "5b55c9885bcca52fbce8a77f",
     *    "max": 250,
     *    "min": null,
     *    "required": false
     * }
     *
     * @apiError 404 Not Found.
     * 
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error": "Question to do not found."
     *     }
    **/
   app.route("/api/organizations/:orgId/questions/:questionId")
   .get(passport.authenticate('jwt', {session: false}), checkAdmin(), surveyController.getQuestion.bind(surveyController))
   .patch(passport.authenticate('jwt', {session: false}), checkAdmin(), surveyController.updateQuestion.bind(surveyController))

   /**
     * @api {GET} /api/organizations/:orgId/surveysTodo  Get all surveys to do list for current user
     * @apiName getSurveysTodo
     * @apiHeader {String} Authorization basic
     * @apiGroup Survey
     * @apiParam (URL){String}              orgId               Organization id
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     *  {
     *   "_id": "5b571004dd224e30146c6cab",
     *   "updatedAt": "2018-07-24T11:39:48.232Z",
     *   "createdAt": "2018-07-24T11:39:48.232Z",
     *   "survey": {
     *       "_id": "5b54d5059c62573260a05f04",
     *       "title": "Survey 1"
     *   },
     *   "respondent": "5a84007831fdc409bc598202",
     *   "isCompleted": false
     *  }
     * ...
     * ]
     *
    **/
   app.route("/api/organizations/:orgId/surveysTodo")
    .get(passport.authenticate('jwt', {session: false}), surveyController.getAllSurveysTodo.bind(surveyController))

    /**
     * @api {GET} /api/organizations/:orgId/survey/:surveyId/excel Survey2 - Get all answers by surveyId in excel file
     * @apiName getAllSurveysTodo
     * @apiHeader {String} Authorization basic
     * @apiGroup Admin
     * @apiParam (URL){String}              orgId               Organization id
     * @apiParam (URL){String}              surveyId               Survey id
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     * {
     *   "updatedAt": "2018-07-27T15:10:37.212Z",
     *  "createdAt": "2018-07-27T14:01:09.851Z",
     *   "isCompleted": true,
     *   "employeeId": "5984342227cd340363dc84aa",
     *   "employeeFirstName": "bill",
     *   "employeeLastName": "allen",
     *   "employeeEmail": "szimkovics.tamas@gmail.com",
     *   "managerId": "5984342227cd340363dc84b0",
     *   "managerFirstName": "benjamin",
     *   "managerLastName": "macrae",
     *   "managerEmail": "szimkovics.tamas+1@gmail.com",
     *   "Answer string 1": "2",
     *   "Answer string 2": "4"
    },
     {
      *   "updatedAt": "2018-07-27T14:01:09.880Z",
      *   "createdAt": "2018-07-27T14:01:09.880Z",
      *   "isCompleted": false,
      *   "employeeId": "5984342227cd340363dc84bb",
      *   "employeeFirstName": "aaron",
      *   "employeeLastName": "hayes",
      *   "employeeEmail": "amanda.hayes@example.com"
     },
     * ...
     * ]
     *
     **/
    app.route("/api/organizations/:orgId/survey/:surveyId/excel")
        .get(passport.authenticate('jwt', {session: false}), surveyController.getAllAnswersSurvey.bind(surveyController));

    /**
     * @api {GET} /api/organizations/:orgId/survey/:surveyId/uncompleted/excel  Get all users who uncompleted survey in excel file
     * @apiName getAllUserWhoUncompletedSurvey
     * @apiHeader {String} Authorization basic
     * @apiGroup Admin
     * @apiParam (URL){String}              orgId               Organization id
     * @apiParam (URL){String}              surveyId               Survey id
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     * {
     *       "employeeId": "5984342227cd340363dc84a9",
     *       "employeeFirstName": "christina",
     *       "employeeLastName": "jacobs",
     *       "employeeEmail": "christina.jacobs@example.com"
     *   },
     * {
     *    "employeeId": "5984342227cd340363dc84c7",
     *    "employeeFirstName": "peter",
     *   "employeeLastName": "szabo",
     *    "employeeEmail": "peter.szabo@hipteam.io"
     * }, ...
     * ]
     *
     **/
    app.route("/api/organizations/:orgId/survey/:surveyId/uncompleted/excel")
        .get(passport.authenticate('jwt', {session: false}), surveyController.getAllUserWhoUncompletedSurvey.bind(surveyController));


    /**
     * @api {GET} /api/organizations/:orgId/surveysTodo/:surveyTodoId Get survey to do by Id for current user
     * @apiName getSurveyTodoById
     * @apiHeader {String} Authorization basic
     * @apiGroup Survey
     * 
     * @apiParam (URL){String}              orgId               Organization id
     * @apiParam (URL){String}              surveyTodoId        Survey to do id
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *    "surveyTodo": {
     *        "_id": "5b51bfa9563ff020d4ef5e48",
     *        "survey": {
     *        "_id": "5b51bf5b81b8af2cf8353290",
     *        "title": "Survey 7"
     *        },
     *    "respondent": "5a84007831fdc409bc598202",
     *    "isCompleted": false,
     *    "manager": "5a84007831fdc409bc598202",
     *    "updatedAt": "2018-07-23T16:01:21.836Z"
     *   },
     *   "questions": [
     *    {
     *       "_id": "5b4f9d5e0d111a08f8f496e2",
     *       "text": "Question 1",
     *       "required": true,
     *       "max": 250,
     *       "min": null,
     *       "answer": {
     *           "_id": "5b55fbd1a3f76d1354c03154",
     *           "questionText": "Question 1",
     *           "answerText": "Bibigon",
     *           "required": false
     *        }
     *    },
     *    {
     *       "_id": "5b5081c3aa357227f44fa504",
     *       "text": "Question 2",
     *       "required": true,
     *       "max": 25,
     *       "min": 1,
     *       "answer": {
     *           "_id": "5b55fbd1a3f76d1354c03155",
     *           "questionText": "Question 2",
     *           "answerText": "Marafon",
     *           "required": true
     *        }
     *    },
     *    {
     *       "_id": "5b51eeba563ff020d4ef5e4a",
     *       "text": "Question 3",
     *       "required": false,
     *       "max": null,
     *       "min": 1,
     *    }
     *    ...
     *   ]
     * }
    **/

    /**
     * @api {PATCH} /api/organizations/:orgId/surveysTodo/:surveyTodoId  Save/Complete survey to do by Id for current user
     * @apiName getSurveyTodoById
     * @apiHeader {String} Authorization basic
     * @apiGroup Survey
     * 
     * @apiParam (URL){String}              orgId               Organization id
     * @apiParam (URL){String}              surveyTodoId        Survey to do id
     * @apiParam (Body){String}             manager             Manager user id
     * @apiParam (Body){Boolean}            isCompleted         Indicates that is pre save or complete
     * @apiParam (Body){Object[]}           answers             Array of the answers.

     * @apiParamExample {json} Request-Example:
     *     {
     *        "manager":"5a84007831fdc409bc598202",
     *        "isCompleted":true,
     *        "answers":[
     *                  {
     *                    "question":"5b4f9d5e0d111a08f8f496e2",
     *                    "questionText": "Question 1",
     *                    "answerText": "Bibigon",
     *                    "required": false,
     *                    "min": null,
     *                    "max": 25
     *                  },
     *                  {
     *                    "question":"5b5081c3aa357227f44fa504",
     *                    "questionText": "Question 2",
     *                    "answerText": "Marafon",
     *                    "required": false,
     *                    "min": null,
     *                    "max": 25
     *                  }
     *                  ...
     *                  ]
     * }
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
    **/
   app.route("/api/organizations/:orgId/surveysTodo/:surveyTodoId")
   .get(passport.authenticate('jwt', {session: false}), surveyController.getSurveyTodo.bind(surveyController))
   .patch(passport.authenticate('jwt', {session: false}), surveyController.saveSurveyTodo.bind(surveyController))

    /**
     * @api {PATCH} /api/organizations/:orgId/surveysTodo/:surveyTodoId/manager Survey TODO - Set survey to do manager
     * @apiName setManagerForSurveyTodo
     * @apiHeader {String} Authorization basic
     * @apiGroup Survey
     * 
     * @apiParam (URL){String}              orgId               Organization id
     * @apiParam (URL){String}              surveyTodoId        Survey to do id
     * @apiParam (Body){String}             manager             manager's user id
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *    "_id": "5b51bfa9563ff020d4ef5e48",
     *    "survey": "5b51bf5b81b8af2cf8353290",
     *    "respondent": "5a84007831fdc409bc598202",
     *    "manager": "5a84007831fdc409bc598202",
     *    "updatedAt": "2018-07-23T14:28:22.678Z",
     *    "isCompleted": false
     * }
     * 
     * * 
     * @apiError 404 Not Found.
     * 
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error": "Survey to do not found."
     *     }
    **/
   app.route("/api/organizations/:orgId/surveysTodo/:surveyTodoId/manager")
   .patch(passport.authenticate('jwt', {session: false}), surveyController.setSurveyTodoManager.bind(surveyController))

   /**
     * @api {GET} /api/organizations/:orgId/surveys/managers Surveys - Search manager
     * @apiName searchManagerForSurveyTodo
     * @apiHeader {String} Authorization basic
     * @apiGroup Survey
     * @apiParam (URL){String}              orgId         Organization id
     * @apiParam (Query string){String}     q             manager's user id
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     *   {
     *      "_id": "5a84007831fdc409bc59820b",
     *      "firstName": "ben",
     *      "lastName": "reyes",
     *      "email": "plenuum.tester+9@hipteam.io",
     *      "pictureUrl": "https://randomuser.me/api/portraits/men/90.jpg",
     *      "orgIds": ["test-organization"]
     *   },
     *   ...
     * ]
    **/
   app.route("/api/organizations/:orgId/surveys/search/manager")
    .get(passport.authenticate('jwt', {session: false}), surveyController.findManager.bind(surveyController))


}