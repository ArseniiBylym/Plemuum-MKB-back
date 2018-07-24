interface Answer {
    surveyTodo: any;
    question: any;
    questionText: string;
    answerText: string;
    required?: boolean;
    min?: number;
    max?: number;
}

export default Answer