import CompassManager from "../manager/compass.manager";
import * as StatusCodes from 'http-status-codes';

export default class CompassController {

    public generateTodoController(req: any, res: any, next: Function) {
        CompassManager.generateTodo(req.body, req.params.orgId, req.user._id)
            .then(savedTodo => res.send(savedTodo))
            .catch((err) => res.status(StatusCodes.BAD_REQUEST).json({error: err.message}));
    }
}