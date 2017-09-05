import * as StatusCodes from 'http-status-codes';
import { GroupModel } from "../../data/database/schema/organization/group.schema";
import BaseController from "./base.controller";
import GroupManager from "../manager/group.manager";
import { validate } from "../../util/input.validator";

export default class GroupController extends BaseController {

    groupManager: GroupManager;

    constructor(groupManager: GroupManager) {
        super();
        this.groupManager = groupManager;
    }

    async getGroups(req: any, res: any, next?: Function) {
        this.groupManager.getGroups(req.params.orgId)
            .then((groups: any[]) => res.status(StatusCodes.CREATED).send(groups))
            .catch((err: any) => BaseController.handleError(err, res));
    };

    async createGroup(req: any, res: any, next?: Function) {
        req.checkBody('name', 'Missing group name').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        return this.groupManager.createGroup(req.params.orgId, req.body)
            .then((group: GroupModel) => res.status(StatusCodes.CREATED).send(group))
            .catch((err: any) => BaseController.handleError(err, res));
    }

    async getGroupById(req: any, res: any, next?: Function) {
        return this.groupManager.getGroupById(req.params.orgId, req.params.groupId)
            .then((group: GroupModel) => res.status(StatusCodes.OK).send(group))
            .catch((err: any) => BaseController.handleError(err, res));
    }

    async getUserGroups(req: any, res: any, next?: Function) {
        return this.groupManager.getUserGroups(req.params.orgId, req.params.userId)
            .then((groups: GroupModel[]) => res.status(StatusCodes.OK).send(groups))
            .catch((err: any) => BaseController.handleError(err, res));
    }

    async putUserIntoGroup(req: any, res: any, next?: Function) {
        req.checkBody('userId', 'Missing userId').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        return this.groupManager.putUserIntoGroup(req.params.orgId, req.body.userId, req.params.groupId)
            .then((result: any) => res.status(StatusCodes.OK).send(result))
            .catch((err: any) => BaseController.handleError(err, res));
    }

    async removeUserFromGroup(req: any, res: any, next?: Function) {
        req.checkBody('userId', 'Missing userId').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        return this.groupManager.removeUserFromGroup(req.params.orgId, req.body.userId, req.params.groupId)
            .then((result: any) => res.status(StatusCodes.OK).send(result))
            .catch((err: any) => BaseController.handleError(err, res));
    }

    async updateGroup(req: any, res: any, next?: Function) {
        req.checkBody('name', 'Missing group name').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        return this.groupManager.updateGroup(req.params.orgId, req.params.groupId, req.body)
            .then((result: any) => res.status(StatusCodes.OK).send(result))
            .catch((err: any) => BaseController.handleError(err, res));
    }
}