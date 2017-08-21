import * as StatusCodes from 'http-status-codes';
import { formError } from "../../util/errorhandler";
import { GroupModel } from "../../data/database/schema/organization/group.schema";
import { GroupDataController } from "../../data/datacontroller/group.datacontroller";
import BaseController from "./base.controller";

export default class GroupController extends BaseController {

    groupDataController: GroupDataController;

    constructor(groupDataController: GroupDataController) {
        super();
        this.groupDataController = groupDataController;
        this.createGroup.bind(this);
    }

    async createGroup(req: any, res: any, next: Function) {
        return this.groupDataController.createGroup(req.params.orgId, req.body)
            .then((group: GroupModel) => BaseController.send(res, StatusCodes.CREATED, group))
            .catch((err: Error) => BaseController.send(res, StatusCodes.BAD_REQUEST, formError(err)));
    }

    getGroupById(req: any, res: any, next: Function) {
        this.groupDataController.getGroupById(req.params.orgId, req.params.groupId)
            .then((group: GroupModel) => BaseController.send(res, StatusCodes.OK, group))
            .catch((err: Error) => res.status(StatusCodes.BAD_REQUEST).send(formError(err)));
    }

    getUserGroups(req: any, res: any, next: Function) {
        this.groupDataController.getUserGroups(req.params.orgId, req.params.userId)
            .then((groups: GroupModel[]) => res.status(StatusCodes.OK).send(groups))
            .catch((err: Error) => res.status(StatusCodes.BAD_REQUEST).send(formError(err)));
    }

    putUserIntoGroup(req: any, res: any, next: Function) {
        this.groupDataController.putUserIntoGroup(req.params.orgId, req.body.userId, req.params.groupId)
            .then((group: GroupModel) => res.status(StatusCodes.OK).send({success: "User has been added"}))
            .catch((err: Error) => res.status(StatusCodes.BAD_REQUEST).send(formError(err)))
    }

    removeUserFromGroup(req: any, res: any, next: Function) {
        this.groupDataController.removeUserFromGroup(req.params.orgId, req.body.userId, req.params.groupId)
            .then((group: GroupModel) => res.status(StatusCodes.OK).send({success: "User has been removed"}))
            .catch((err: Error) => res.status(StatusCodes.BAD_REQUEST).send(formError(err)))
    }

    updateGroup(req: any, res: any, next: Function) {
        this.groupDataController.updateGroup(req.params.orgId, req.params.groupId, req.body)
            .then((group: GroupModel) => res.status(StatusCodes.OK).send({success: "Group has been updated"}))
            .catch((err: Error) => res.status(StatusCodes.BAD_REQUEST).send(formError(err)))
    }


}