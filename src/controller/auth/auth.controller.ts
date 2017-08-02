import { Request, Response } from "express";

export default class AuthController {
    constructor() {
    }

    public login(req: Request, res: Response, next: Function) {
        res.json({message: 'Login'})
    }
}