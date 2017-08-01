import { Express, Request, Response } from "express";

export default class AuthController {
    constructor() { }

    public saveUser(req: Request, res: Response, next: Function) {
        res.json({ message: 'Login' })
    }
}