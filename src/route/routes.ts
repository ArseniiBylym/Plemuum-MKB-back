import { Express } from 'express';
import UserRoute from './user.route';
import FeedbackRoute from './feedback.route';
import AuthRoute from './auth.route';
import TagRoute from './tag.route';
import OrganizationRoute from './organization.route';
import RequestRoute from './request.route';
import * as ControllerFactory from '../factory/controller.factory'

export default (express: Express) => {
    UserRoute(express, ControllerFactory.getUserController());
    FeedbackRoute(express, ControllerFactory.getFeedbackController());
    AuthRoute(express, ControllerFactory.getAuthController());
    TagRoute(express, ControllerFactory.getTagController());
    TagRoute(express, ControllerFactory.getTagController());
    OrganizationRoute(express, ControllerFactory.getOrganizationController());
    RequestRoute(express, ControllerFactory.getRequestController());
}
