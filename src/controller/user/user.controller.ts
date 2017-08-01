import { Request, Response } from "express";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { User } from "../../data/models/user.model";
import * as ErrorHandler from '../../util/errorhandler';

export default class UserController {

    private userDataController: UserDataController;

    constructor(userDataController: UserDataController) {
        this.userDataController = userDataController;
    }

    //TODO implement this
    public showRegistrationForm(req: Request, res: Response,) {
        res.render("newuser", {title: "Express", organizations: [
            {dbName: 'hipteam', name: 'hipteam'}, {dbName: 'other', name: 'other'}]});
    }

    public createNewUser(req: Request, res: Response,) {
        const user: User = req.body;
        if (user) {
            this.userDataController.saveUser(user)
                .then((result) => res.send(result))
                .catch((error) => res.status(400).json(ErrorHandler.getFriendlyErrorFromMongooseError(error)));
        } else {
            res.status(400).json({error: "invalid input"});
        }
    }

    public getOrganizationUsers(req: Request, res: Response,) {
        this.userDataController.getOrganizationUsers(req.params.orgId)
            .then((result) => res.send(result))
            .catch((error) => res.status(400).json(ErrorHandler.getFriendlyErrorFromMongooseError(error)));
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