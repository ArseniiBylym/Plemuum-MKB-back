import CompassManager from "../manager/compass.manager";
import * as StatusCodes from 'http-status-codes';
import { formError } from "../util/errorhandler";

export default class CompassController {

    public generateTodo(req: any, res: any, next: Function) {
        CompassManager.generateTodo(req.body, req.params.orgId, req.user._id)
            .then(savedTodo => res.send(savedTodo))
            .catch((err) => res.status((err.name === 'ValidationError')
                ? StatusCodes.INTERNAL_SERVER_ERROR
                : StatusCodes.BAD_REQUEST).send(formError(err)));
    }
}