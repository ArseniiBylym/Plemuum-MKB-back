import { Request, Response } from "express";
import UserDataController from "../../data/datacontroller/user.datacontroller";

export default class UserController {

    private userDataController: UserDataController;

    constructor(userDataController: UserDataController) {
        this.userDataController = userDataController;
    }

    //TODO implement this
    public showRegistrationForm(req: Request, res: Response,) {
        res.render("newuser", {title: "Express", organizations: []});
    }

    public createNewUser(req: Request, res: Response,) {
        this.userDataController.handleUserSave()
            .then((result) => res.send(result))
            .catch((error) => res.json({error: error}));
    }

    //TODO implement this
    public getOrganizationUsers(req: Request, res: Response,) {
        res.send({orgId: req.params.orgId});
    }

    //TODO implement this
    public getUserByIdFromOrganization(req: Request, res: Response,) {
        res.json(
            {
                orgId: req.params.orgId,
                userId: req.params.userId
            }
        );
    }

    //TODO implement this
    public resetPassword(req: Request, res: Response,) {
        res.json({msg: "reset password"});
    }

    //TODO implement this
    public setPassword(req: Request, res: Response,) {
        res.json({msg: "set password"});
    }

    //TODO implement this
    public changePassword(req: Request, res: Response,) {
        res.json({msg: "change password"});
    }

    //TODO implement this
    public setPicture(req: Request, res: Response,) {
        res.json({msg: "set picture"});
    }
}