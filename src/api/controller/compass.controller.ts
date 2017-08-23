import CompassManager from "../manager/compass.manager";
import * as StatusCodes from 'http-status-codes';
import { formError } from "../../util/errorhandler";
import BaseController from "./base.controller";

export default class CompassController extends BaseController {

    generateTodo(req: any, res: any) {
        CompassManager.generateTodo(req.body, req.params.orgId, req.user._id)
            .then(savedTodo => res.send(savedTodo))
            .catch((err) => res.status((err.name === 'ValidationError')
                ? StatusCodes.INTERNAL_SERVER_ERROR
                : StatusCodes.BAD_REQUEST).send(formError(err)));
    }

    answerCompass(req: any, res: any) {
        CompassManager.answerCompass(req.params.orgId, req.body)
            .then(savedAnswer => BaseController.send(res, 200, savedAnswer))
            .catch((err) => BaseController.send(
                res,
                (err.name === 'ValidationError')
                    ? StatusCodes.INTERNAL_SERVER_ERROR
                    : StatusCodes.BAD_REQUEST,
                formError(err)));
    }

    updateSkill(req: any, res: any) {
        req.checkBody('_id', 'Missing skill id').notEmpty();
        req.checkBody('name', 'Missing skill name').notEmpty();
        req.checkBody('sentences', 'Missing skill sentence').notEmpty();
        req.checkBody('sentences', 'Skill must contain at least one sentence').len({min: 1});

        CompassManager.updateSkill(req.params.orgId, req.body)
            .then(updatedSkill => BaseController.send(res, 200, updatedSkill))
            .catch((err) => BaseController.send(
                res,
                (err.name === 'ValidationError')
                    ? StatusCodes.INTERNAL_SERVER_ERROR
                    : StatusCodes.BAD_REQUEST,
                formError(err)));
    }

    async createNewSkill(req: any, res: any) {
        req.checkBody('name', 'Missing skill name').notEmpty();
        req.checkBody('sentences', 'Missing skill sentence').notEmpty();
        req.checkBody('sentences', 'Skill must contain at least one sentence').len({min: 1});

        const validationResults = await req.getValidationResult();
        if (!validationResults.isEmpty()) {
            res.status(400);
            res.send({error: "Validation error", hint: validationResults.array()});
            return;
        }
        CompassManager.createNewSkill(req.params.orgId, req.body)
            .then(savedSkill => BaseController.send(res, StatusCodes.CREATED, savedSkill))
            .catch((err) => BaseController.send(res, StatusCodes.INTERNAL_SERVER_ERROR, {error: err}))
    }

    static createNewSkillForm(req: any, res: any): void {
        res.render("newSkill", {title: "Add new competence", orgId: req.params.orgId});
    }

}