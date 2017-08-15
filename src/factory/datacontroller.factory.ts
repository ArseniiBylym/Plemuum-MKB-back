import FeedbackDataController from "../data/datacontroller/feedback.datacontroller";
import * as DatabaseFactory from './database.factory';
import RequestDataController from "../data/datacontroller/request.datacontroller";
import TagDataController from "../data/datacontroller/tag.datacontroller";
import ResetPasswordDataController from "../data/datacontroller/resetpassword.datacontroller";
import OrganizationDataController from "../data/datacontroller/organization.datacontroller";
import GroupDataController from "../data/datacontroller/group.datacontroller";

let feedbackDataControllerInstance: FeedbackDataController;
let requestDataController: RequestDataController;
let tagDataController: TagDataController;
let resetPasswordDataController: ResetPasswordDataController;
let organizationDataController: OrganizationDataController;
let groupDataController: GroupDataController;

/* #########################     PUBLIC      ########################## */

const getFeedbackDataController = (): FeedbackDataController =>
    getDataController(feedbackDataControllerInstance, FeedbackDataController);

const getRequestDataController = (): RequestDataController =>
    getDataController(requestDataController, RequestDataController);

const getTagDataController = (): TagDataController =>
    getDataController(tagDataController, TagDataController);

const getResetPasswordDataController = (): ResetPasswordDataController =>
    getDataController(resetPasswordDataController, ResetPasswordDataController);

const getOrganizationDataController = (): OrganizationDataController =>
    getDataController(organizationDataController, OrganizationDataController);

const getGroupDataController = (): GroupDataController =>
    getDataController(groupDataController, GroupDataController);

/* #########################     PRIVATE      ########################## */

function getDataController(instance: any, dataController: any) {
    if (!instance) {
        instance = new dataController(DatabaseFactory.getDatabaseManager());
    }
    return instance;
}

export {
    getFeedbackDataController,
    getRequestDataController,
    getTagDataController,
    getResetPasswordDataController,
    getOrganizationDataController,
    getGroupDataController
}