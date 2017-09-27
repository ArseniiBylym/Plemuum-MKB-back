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

        if (!await validate(req, res)) {
            return;
        }

        return this.compassManager.answerCard(req.body.aboutUserId, req.user._id, req.params.orgId)
            .then(savedTodo => res.status(StatusCodes.OK).send(savedTodo))
            .catch((err) => res.status(BaseController.getErrorStatus(err)).send(formError(err)));
    }

    async answerCompass(req: any, res: any) {
        req.checkBody('compassTodo', 'Missing compassTodo').notEmpty();
        req.checkBody('sender', 'Missing sender').notEmpty();
        req.checkBody('sentencesAnswer', 'Missing sentencesAnswer').notEmpty();
        req.checkBody('sentencesAnswer', 'sentencesAnswer must be an Array').len(1);

        if (!await validate(req, res)) {
            return;
        }

        return CompassManager.answerCompass(req.params.orgId, req.body)
            .then(savedAnswer => res.status(StatusCodes.OK).send(savedAnswer))
            .catch((err) => res.status(BaseController.getErrorStatus(err)).send(formError(err)));
    }

    async getSkills(req: any, res: any) {
        return this.compassManager.getSkills(req.params.orgId)
            .then(result => res.status(StatusCodes.OK).send(result))
            .catch((err) => res.status(BaseController.getErrorStatus(err)).send(formError(err)));
    }

    async createOrUpdateSkill(req: any, res: any) {
        req.checkBody('name', 'Missing skill name').notEmpty();
        req.checkBody('sentences', 'Missing skill sentence').notEmpty();
        req.checkBody('sentences', 'Skill must contain at least one sentence').len({min: 1});

        if (!await validate(req, res)) {
            return;
        }

        return CompassManager.createOrUpdateSkill(req.params.orgId, req.body)
            .then(updatedSkill => res.status(StatusCodes.OK).send(updatedSkill))
            .catch((err) => res.status(BaseController.getErrorStatus(err)).send(formError(err)));
    }

    async getStatistics(req: any, res: any) {
        return this.compassManager.getStatistics(req.params.orgId, req.user._id)
            .then(statistics => res.status(StatusCodes.OK).send(statistics))
            .catch((err) => res.status(BaseController.getErrorStatus(err)).send(formError(err)));
    }
}