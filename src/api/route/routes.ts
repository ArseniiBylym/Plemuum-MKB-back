import { Express } from 'express';
import UserRoute from './user.route';
import FeedbackRoute from './feedback.route';
import TagRoute from './tag.route';
import OrganizationRoute from './organization.route';
import RequestRoute from './request.route';
import SessionRoute from './session.route';
import GroupRoute from './group.route';
import CompassRoute from './compass.route';
import NotificationRoute from './notification.route';
import LogRoute from './log.route';
import * as ControllerFactory from '../../factory/controller.factory'
import CompassController from "../controller/compass.controller";
import CompassManager from "../manager/compass.manager";
import { getGroupDataController } from "../../data/datacontroller/group.datacontroller";
import { getOrganizationDataController } from "../../data/datacontroller/organization.datacontroller";
import { requestDataController } from "../../data/datacontroller/request.datacontroller";
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
    CompassRoute(express, new CompassController(
        new CompassManager(getGroupDataController(), getOrganizationDataController(), requestDataController)));
    LogRoute(express, new LogController());
}
