import { Request, Response } from "express";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { User } from "../../data/models/user.model";
import BaseController from "../base.controller";


export default class UserController extends BaseController {

    private userDataController: UserDataController;

    constructor(userDataController: UserDataController) {
        super();
        this.userDataController = userDataController;
    }

    //TODO implement this
    public showRegistrationForm(req: Request, res: Response,) {
        res.render("newuser", {
            title: "Express", organizations: [
                {dbName: 'hipteam', name: 'hipteam'}, {dbName: 'other', name: 'other'}]
        });
    }

    public createNewUser(req: Request, res: Response,) {
        const user: User = req.body;
        if (user) {
            this.callController(this.userDataController.saveUser(user), res, 201, 400);
        } else {
            res.status(400).json({error: "invalid input"});
        }
    }

    public getOrganizationUsers(req: Request, res: Response,) {
        this.callController(this.userDataController.getOrganizationUsers(req.params.orgId), res, 200, 400);
    }

    public getUserByIdFromOrganization(req: Request, res: Response,) {
        this.callController(this.userDataController.getUserById(req.params.orgId, req.params.userId), res, 200, 400);
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