interface CompassTodo {
    about: string;
    recipient: string;
    createdBy: string;
    message: string;
    answered?: boolean;
    questions: Array<Object>;
}

export default CompassTodo