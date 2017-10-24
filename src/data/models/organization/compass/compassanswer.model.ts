export enum ANSWER_TYPES {
    AGREE = "AGREE",
    DISAGREE = "DISAGREE",
    SKIP = "SKIP",
}

interface CompassAnswer {
    compassTodo: string;
    sender: string;
    sentencesAnswer: Array<Object>;
}

export default CompassAnswer