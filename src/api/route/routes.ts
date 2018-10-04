import { Express } from 'express';
import UserRoute from './user.route';
import FeedbackRoute from './feedback.route';
import TagRoute from './tag.route';
import OrganizationRoute from './organization.route';
import RequestRoute from './request.route';
import SessionRoute from './session.route';
import GroupRoute from './group.route';
import CompassRoute from './compass.route';
import SurveyRoute from './survey.route';
import NotificationRoute from './notification.route';
import LogRoute from './log.route';
import EmailTemplateRoute from './emailTemplate.route';
import * as ControllerFactory from '../../factory/controller.factory'
import LogController from "../controller/log.controller";

/**
 * @apiDefine admin Admin access rights needed.
 */
export default (express: Express) => {
    UserRoute(express, ControllerFactory.getUserController());
    NotificationRoute(express, ControllerFactory.getNotificationController());
    FeedbackRoute(express, ControllerFactory.getFeedbackController());
    TagRoute(express, ControllerFactory.getTagController());
    OrganizationRoute(express, ControllerFactory.getOrganizationController());
    RequestRoute(express, ControllerFactory.getRequestController());
    SessionRoute(express, ControllerFactory.getSessionController(), ControllerFactory.getUserController());
    GroupRoute(express, ControllerFactory.getGroupController());
    CompassRoute(express, ControllerFactory.getCompassController());
    SurveyRoute(express, ControllerFactory.getSurveyController());
    LogRoute(express, new LogController());
    EmailTemplateRoute(express, ControllerFactory.getEmailTemplateController());
}
