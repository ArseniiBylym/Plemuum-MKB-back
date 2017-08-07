import BaseController from "./base.controller";
import { Request, Response } from "express";

export default class SessionController extends BaseController {

    // TODO Implement this
    public login(req: Request, res: Response, next: Function) {
        res.send({})
    }

    // TODO Implement this
    public logout(req: Request, res: Response, next: Function) {
        res.send({})
    }

    // TODO Implement this
    public checkToken(req: Request, res: Response, next: Function) {
        res.send({})
    }
}