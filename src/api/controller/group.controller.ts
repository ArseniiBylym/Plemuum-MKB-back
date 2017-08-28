import * as StatusCodes from 'http-status-codes';
import {formError} from "../../util/errorhandler";
import {GroupModel} from "../../data/database/schema/organization/group.schema";
import {GroupDataController} from "../../data/datacontroller/group.datacontroller";
import BaseController from "./base.controller";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import CompassDataController from "../../data/datacontroller/compass.datacontroller";

export default class GroupController extends BaseController {

    groupDataController: GroupDataController;

    constructor(groupDataController: GroupDataController) {
        super();
        this.groupDataController = groupDataController;
        this.createGroup.bind(this);
    }

    getGroups = async (req: any, res: any, next?: Function) => {
        try {
            const orgId: string = req.params.orgId;
            const allGroups: GroupModel[] = await this.groupDataController.getGroups(orgId);
            const resultGroups = await Promise.all(allGroups.map(async (group: any) => {
                group.users = await Promise.all(group.users.map((userId: string) =>
                    UserDataController.getUserById(orgId, userId)));
                group.skills = await Promise.all(group.skills.map((skillId: string) =>
                    CompassDataController.getSkillById(orgId, skillId)));
                return group;
            }));
            res.send(resultGroups);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        }
    };

    createGroup(req: any, res: any, next?: Function) {
        return this.groupDataController.createGroup(req.params.orgId, req.body)
            .then((group: GroupModel) => res.status(StatusCodes.CREATED).send(group))
            .catch((err: Error) => res.status(StatusCodes.BAD_REQUEST).send(formError(err)));
    }

    getGroupById(req: any, res: any, next?: Function) {
        return this.groupDataController.getGroupById(req.params.orgId, req.params.groupId)
            .then((group: GroupModel) => BaseController.send(res, StatusCodes.OK, group))
            .catch((err: Error) => BaseController.send(res, StatusCodes.BAD_REQUEST, formError(err)));
    }

    getUserGroups(req: any, res: any, next?: Function) {
        return this.groupDataController.getUserGroups(req.params.orgId, req.params.userId)
            .then((groups: GroupModel[]) => BaseController.send(res, StatusCodes.OK, groups))
            .catch((err: Error) => BaseController.send(res, StatusCodes.BAD_REQUEST, formError(err)));
    }

    putUserIntoGroup(req: any, res: any, next?: Function) {
        return this.groupDataController.putUserIntoGroup(req.params.orgId, req.body.userId, req.params.groupId)
            .then((group: GroupModel) =>
                BaseController.send(res, StatusCodes.OK, {success: "User has been added"}))
            .catch((err: Error) => BaseController.send(res, StatusCodes.BAD_REQUEST, formError(err)))
    }

    removeUserFromGroup(req: any, res: any, next?: Function) {
        return this.groupDataController.removeUserFromGroup(req.params.orgId, req.body.userId, req.params.groupId)
            .then((group: GroupModel) =>
                BaseController.send(res, StatusCodes.OK, {success: "User has been removed"}))
            .catch((err: Error) => BaseController.send(res, StatusCodes.BAD_REQUEST, formError(err)))
    }

    updateGroup(req: any, res: any, next?: Function) {
        return this.groupDataController.updateGroup(req.params.orgId, req.params.groupId, req.body)
            .then((group: GroupModel) =>
                BaseController.send(res, StatusCodes.OK, {success: "Group has been updated"}))
            .catch((err: Error) => BaseController.send(res, StatusCodes.BAD_REQUEST, formError(err)))
    }
}