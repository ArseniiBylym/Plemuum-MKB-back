import { Express, Request, Response } from "express";
import * as userDataController from "../../data/datacontroller/user.datacontroller"
import { User } from "../../data/models/user.model";

const init = (express: Express): void => {
    express.route('/user/save').get((req: Request, res: Response) => {
        const random: number = Math.floor(Math.random() * (1000 - 0 + 1));
        const user: User = {
            firstName: "Kovacs",
            lastName: "Bela",
            email: `bela.kovacs@${random}gmail.com`,
            tokens: [],
            pictureUrl: "",
            orgIds: [],
            password: "asd123"
        }

        userDataController.saveUser(user)
            .then((user: User) => {
                res.send(user);
            })
            .catch((error) => {
                res.json({
                    error: error
                });
            });
    })
}

export { init };