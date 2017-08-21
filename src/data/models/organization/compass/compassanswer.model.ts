interface CompassAnswer {
    compassTodoId: string;
    senderId: string;
    recipientId: string;
    areConnected: boolean;
    sentencesAnswer: Array<Object>;
}

export default CompassAnswer