import CompassManager from "../manager/compass.manager";
import * as StatusCodes from 'http-status-codes';
import { formError } from "../../util/errorhandler";
import BaseController from "./base.controller";
import { validate } from "../../util/input.validator";

export default class CompassController extends BaseController {

    compassManager: CompassManager;

    constructor(compassManager: CompassManager) {
        super();
        this.compassManager = compassManager;
    }

    async answerCard(req: any, res: any) {
        req.checkBody('aboutUserId', 'Missing about user\'s ID').notEmpty();
        req.checkBody('senderId', 'Missing sender user\'s ID').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        return this.compassManager.answerCard(req.body.aboutUserId, req.body.senderId, req.params.orgId, req.user._id)
            .then(savedTodo => res.status(StatusCodes.OK).send(savedTodo))
            .catch((err) => res.status(BaseController.getErrorStatus(err)).send(formError(err)));
    }

    async answerCompass(req: any, res: any) {
        CompassManager.answerCompass(req.params.orgId, req.body)
            .then(savedAnswer => BaseController.send(res, StatusCodes.OK, savedAnswer))
            .catch((err) => BaseController.send(res, StatusCodes.INTERNAL_SERVER_ERROR, formError(err)));
    }

    async updateSkill(req: any, res: any) {
        req.checkBody('_id', 'Missing skill id').notEmpty();
        req.checkBody('name', 'Missing skill name').notEmpty();
        req.checkBody('sentences', 'Missing skill sentence').notEmpty();
        req.checkBody('sentences', 'Skill must contain at least one sentence').len({min: 1});

        if (!await validate(req, res)) {
            return;
        }

        CompassManager.updateSkill(req.params.orgId, req.body)
            .then(updatedSkill => BaseController.send(res, StatusCodes.OK, updatedSkill))
            .catch((err) => BaseController.send(res, StatusCodes.INTERNAL_SERVER_ERROR, formError(err)));
    }

    async createNewSkill(req: any, res: any) {
        req.checkBody('name', 'Missing skill name').notEmpty();
        req.checkBody('sentences', 'Missing skill sentence').notEmpty();
        req.checkBody('sentences', 'Skill must contain at least one sentence').len({min: 1});

        if (!await validate(req, res)) {
            return;
        }

        CompassManager.createNewSkill(req.params.orgId, req.body)
            .then(savedSkill => BaseController.send(res, StatusCodes.CREATED, savedSkill))
            .catch((err) => BaseController.send(res, StatusCodes.INTERNAL_SERVER_ERROR, {error: err}))
    }

    static createNewSkillForm(req: any, res: any): void {
        res.render("newSkill", {title: "Add new competence", orgId: req.params.orgId});
    }

    async getStatistics(req: any, res: any) {
        return this.compassManager.getStatistics(req.params.orgId, req.params.userId)
            .then(statistics => BaseController.send(res, StatusCodes.OK, statistics))
            .catch((err) => BaseController.send(res, StatusCodes.INTERNAL_SERVER_ERROR, {error: err}))
    }
}