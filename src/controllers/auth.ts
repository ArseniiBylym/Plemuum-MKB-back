import {Express, Request, Response} from "express";

module.exports.set = (express: Express) => {
    express.route('/login')
        .get((req: Request, res: Response) => {
            res.json({
                message: 'Login'
            })
        })
};