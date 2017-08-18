import { User } from "../../common/user.model";

interface CompassTodo {
    aboutUser: User;
    recipientId: string;
    sender: User;
    message: string;
    sentences: Array<Object>;
}

export default CompassTodo