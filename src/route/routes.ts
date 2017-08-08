import { Express } from 'express';
import UserRoute from './user.route';
import FeedbackRoute from './feedback.route';
import TagRoute from './tag.route';
import OrganizationRoute from './organization.route';
import RequestRoute from './request.route';
import SessionRoute from './session.route';
import * as ControllerFactory from '../factory/controller.factory'

export default (express: Express) => {
    UserRoute(express, ControllerFactory.getUserController());
    FeedbackRoute(express, ControllerFactory.getFeedbackController());
    TagRoute(express, ControllerFactory.getTagController());
    OrganizationRoute(express, ControllerFactory.getOrganizationController());
    RequestRoute(express, ControllerFactory.getRequestController());
    SessionRoute(express, ControllerFactory.getSessionController());
}
