import { Express } from "express";
import * as passport from "passport";
import NotificationController from "../controller/notification.controller";
import checkAdmin from '../../middleware/admin.checker';

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
    app.route("/api/users/me/notification")
        .post(passport.authenticate('jwt', {session: false}), notificationController.setNotificationDevice.bind(notificationController))
        .patch(passport.authenticate('jwt', {session: false}), notificationController.refreshNotificationDevice.bind(notificationController))
        .delete(passport.authenticate('jwt', {session: false}), notificationController.removeNotificationToken.bind(notificationController));

    app.route("/api/notification/send")
        .post(passport.authenticate('jwt', {session: false}), checkAdmin(), notificationController.sendNotification.bind(notificationController))

}