interface CompassTodo {
    about: string;
    owner: string;
    createdBy: string;
    message: string;
    answered?: boolean;
    questions: Array<Object>;
}

export default CompassTodo