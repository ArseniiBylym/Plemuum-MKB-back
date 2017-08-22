import CompassManager from "../manager/compass.manager";
import * as StatusCodes from 'http-status-codes';
import { formError } from "../../util/errorhandler";
import BaseController from "./base.controller";

export default class CompassController extends BaseController {

    public generateTodo(req: any, res: any) {
        CompassManager.generateTodo(req.body, req.params.orgId, req.user._id)
            .then(savedTodo => res.send(savedTodo))
            .catch((err) => res.status((err.name === 'ValidationError')
                ? StatusCodes.INTERNAL_SERVER_ERROR
                : StatusCodes.BAD_REQUEST).send(formError(err)));
    }

    public answerCompass(req: any, res: any) {
        CompassManager.answerCompass(req.params.orgId, req.body)
            .then(savedAnswer => BaseController.send(res, 200, savedAnswer))
            .catch((err) => BaseController.send(
                res,
                (err.name === 'ValidationError')
                    ? StatusCodes.INTERNAL_SERVER_ERROR
                    : StatusCodes.BAD_REQUEST,
                formError(err)));
    }
}