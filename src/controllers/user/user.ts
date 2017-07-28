import { Express, Request, Response } from "express";
import { User } from "../../data/models/user.model";
import { UserDataController } from "../../data/datacontroller/user.datacontroller";

let instance: UserController;

export class UserController {

    private userDataController: UserDataController;

    constructor(userDataController: UserDataController) {
        this.userDataController = userDataController;
    }

    public register(express: Express) {
        express.route('/user/save').get((req: Request, res: Response) => {
            this.handleUserSave()
                .then((result) => res.send(result))
                .catch((error) => res.json({ error: error }));
        });
    }

    public handleUserSave(): Promise<Object> {
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
        return this.userDataController.saveUser(user)
    }

}

const factory = (userDataController: UserDataController) => {
    if (instance) {
        return instance;
    } else {
        return new UserController(userDataController);
    }
}


export default factory;