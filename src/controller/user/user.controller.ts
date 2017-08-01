import {Request, Response} from "express";
import UserDataController from "../../data/datacontroller/user.datacontroller";

export default class UserController {

    private userDataController: UserDataController;

    constructor(userDataController: UserDataController) {
        this.userDataController = userDataController;
    }

    public handleSaveUserRequest(req: Request, res: Response, next: Function) {
        this.userDataController.handleUserSave()
            .then((result) => res.send(result))
            .catch((error) => res.json({error: error}));
    }
}