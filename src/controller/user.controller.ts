import { Request, Response } from "express";
import UserDataController from "../data/datacontroller/user.datacontroller";
import { User } from "../data/models/user.model";
import BaseController from "./base.controller";
import * as crypto from 'crypto';
import ResetPasswordDataController from "../data/datacontroller/resetpassword.datacontroller";
import { UserModel } from "../data/database/schema/user.schema";

export default class UserController extends BaseController {

    private userDataController: UserDataController;
    private resetPasswordDataController: ResetPasswordDataController;

    constructor(userDataController: UserDataController, resetPasswordDataController: ResetPasswordDataController) {
        super();
        this.userDataController = userDataController;
        this.resetPasswordDataController = resetPasswordDataController;
    }

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

    public resetPassword(req: Request, res: Response,) {
        let data = req.body;
        let email = data.email;
        let user: UserModel;

        this.userDataController.getUserByEmail(data.email)
            .then((u: UserModel) => {
                user = u;
                const {token, token_expiry} = this.generateToken(1);
                const data = {userId: String(user["_id"]), token: token, token_expiry: token_expiry, reseted: false};
                return this.resetPasswordDataController.saveResetPassword(data)
            })
            .then(resetPassword => {
                const link = req.header('Origin') + "/set_new_password?token=" + resetPassword.token + "&email="
                    + user.email + (req.query.welcome ? "&welcome=true" : ""); //TODO header is undefined, do not forget to check why
                //sendResetEmail(user.email, link); //TODO implement email notification
                res.json({email: user.email, link: link});
            })
            .catch(err => res.status(400).send({error: err}));
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

    private generateToken(days: number) {
        let token = crypto.randomBytes(64).toString('hex');
        let token_expiry = new Date();
        let token_duration = process.env.TOKEN_DURATION;
        token_expiry.setDate(token_expiry.getDate() + days.valueOf());
        return {token, token_expiry}
    }
}