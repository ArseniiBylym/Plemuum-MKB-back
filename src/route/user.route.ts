import {Express} from 'express';
import UserController from "../controller/user/user.controller";

export default (express: Express, userController: UserController) => {
    express.route('/user/save').get(userController.handleSaveUserRequest.bind(userController));
}