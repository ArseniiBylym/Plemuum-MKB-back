import * as StatusCodes from 'http-status-codes';
import { GroupModel } from "../../data/database/schema/organization/group.schema";
import BaseController from "./base.controller";
import { validate } from "../../util/input.validator";
import GroupManager from "../interactor/group.interactor";

export default class GroupController extends BaseController {

    groupManager: GroupManager;

    constructor(groupManager: GroupManager) {
        super();
        this.groupManager = groupManager;
    }

    async getGroups(req: any, res: any) {
        this.groupManager.getGroups(req.params.orgId)
            .then((result: any[]) => this.respond(StatusCodes.OK, req, res, result))
            .catch((err: any) => this.handleError(err, req, res));
    };

    async createGroup(req: any, res: any) {
        req.checkBody('name', 'Missing group name').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        return this.groupManager.createGroup(req.params.orgId, req.body)
            .then((result: GroupModel) => this.respond(StatusCodes.CREATED, req, res, result))
            .catch((err: any) => this.handleError(err, req, res));
    }

    async getGroupById(req: any, res: any) {
        return this.groupManager.getGroupById(req.params.orgId, req.params.groupId)
            .then((result: GroupModel) => this.respond(StatusCodes.OK, req, res, result))
            .catch((err: any) => this.handleError(err, req, res));
    }

    async getUserGroups(req: any, res: any) {
        return this.groupManager.getUserGroups(req.params.orgId, req.user._id)
            .then((result: GroupModel[]) => this.respond(StatusCodes.OK, req, res, result))
            .catch((err: any) => this.handleError(err, req, res));
    }

    async putUserIntoGroup(req: any, res: any) {
        req.checkBody('userId', 'Missing userId').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        return this.groupManager.putUserIntoGroup(req.params.orgId, req.body.userId, req.params.groupId)
            .then((result: any) => this.respond(StatusCodes.OK, req, res, result))
            .catch((err: any) => this.handleError(err, req, res));
    }

    async removeUserFromGroup(req: any, res: any) {
        req.checkBody('userId', 'Missing userId').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        return this.groupManager.removeUserFromGroup(req.params.orgId, req.body.userId, req.params.groupId)
            .then((result: any) => this.respond(StatusCodes.OK, req, res, result))
            .catch((err: any) => this.handleError(err, req, res));
    }

    async updateGroup(req: any, res: any) {
        req.checkBody('_id', 'Missing _id').notEmpty();
        req.checkBody('name', 'Missing group name').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        return this.groupManager.updateGroup(req.params.orgId, req.body)
            .then((result: any) => this.respond(StatusCodes.OK, req, res, result))
            .catch((err: any) => this.handleError(err, req, res));
    }

    async getAnswerCardUsers(req: any, res: any) {
        return this.groupManager.getAnswerCardUsers(req.params.orgId, req.user._id)
            .then((result: any) => this.respond(StatusCodes.OK, req, res, result))
            .catch((err: any) => this.handleError(err, req, res));
    }
}