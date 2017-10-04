import { Express } from "express";
import * as passport from "passport";
import NotificationController from "../controller/notification.controller";

export default (app: Express, notificationController: NotificationController) => {

    /**
     * @api {POST} /api/users/me/notification Add a notification Token
     * @apiVersion 2.0.1
     * @apiName add notification token
     * @apiGroup Notification
     * @apiDescription Add a notification token to a device that is subscribing to receive notification
     *
     * Authorization: Bearer {token}
     *
     * @apiParam (Body){String} token The unique identifier of the notification device on the notification service
     *
     * @apiSuccess (Success 200) {String} message Success message
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "message": "Notification token has been set"
     * }
     */

    /**
     * @api {PATCH} /api/users/me/notification Set a new token
     * @apiVersion 2.0.1
     * @apiName set new notification token
     * @apiGroup Notification
     * @apiDescription Set the new unique token, replacing the old one.
     *
     * Authorization: Bearer {token}
     *
     * @apiParam (Body){String} oldToken The current unique identifier of the notification device on the notification service
     * @apiParam (Body){String} newToken The new unique identifier of the notification device on the notification service to be used in replacement of the oldToken
     *
     * @apiSuccess (Success 200) {String} message Success message
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "message": "Notification token has been refreshed"
     * }
     */

    /**
     * @api {DELETE} /api/users/me/notification Delete a token
     * @apiVersion 2.0.1
     * @apiName delete notification token
     * @apiGroup Notification
     * @apiDescription Delete a token when the device is subscribed
     *
     * Authorization: Bearer {token}
     *
     * @apiParam (Body){String} token The unique identifier of the notification device on the notification service to be deleted
     *
     * @apiSuccess (Success 200) {String} message Success message
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "message": "Notification token has been removed"
     * }
     */

    /**
     * @api {POST} /api/user/setNotificationDevice Add a notification Token
     * @apiVersion 2.0.0
     * @apiName add notification token
     * @apiGroup Notification
     * @apiDescription Add a notification token to a device that is subscribing to receive notification
     *
     * Authorization: Bearer {token}
     *
     * @apiParam {String} token The unique identifier of the notification device on the notification service
     *
     * @apiSuccess (Success 200) {String} message Success message
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "message": "Notification token has been set"
     * }
     */

    /**
     * @api {PATCH} /api/user/setNotificationDevice Set a new token
     * @apiVersion 2.0.0
     * @apiName set new notification token
     * @apiGroup Notification
     * @apiDescription Set the new unique token, replacing the old one.
     *
     * Authorization: Bearer {token}
     *
     * @apiParam {String} oldToken The current unique identifier of the notification device on the notification service
     * @apiParam {String} newToken The new unique identifier of the notification device on the notification service to be used in replacement of the oldToken
     *
     * @apiSuccess (Success 200) {String} message Success message
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "message": "Notification token has been refreshed"
     * }
     */

    /**
     * @api {DELETE} /api/user/setNotificationDevice Delete a token
     * @apiVersion 2.0.0
     * @apiName delete notification token
     * @apiGroup Notification
     * @apiDescription Delete a token when the device is subscribed
     *
     * Authorization: Bearer {token}
     *
     * @apiParam {String} token The unique identifier of the notification device on the notification service to be deleted
     *
     * @apiSuccess (Success 200) {String} message Success message
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "message": "Notification token has been removed"
     * }
     */
    app.route("/api/users/me/notification")
        .post(passport.authenticate('bearer', {session: false}), notificationController.setNotificationDevice.bind(notificationController))
        .patch(passport.authenticate('bearer', {session: false}), notificationController.refreshNotificationDevice.bind(notificationController))
        .delete(passport.authenticate('bearer', {session: false}), notificationController.removeNotificationToken.bind(notificationController));

    app.route("/api/notification/send")
        .post(passport.authenticate('basic', {session: false}), notificationController.sendNotification.bind(notificationController))

}