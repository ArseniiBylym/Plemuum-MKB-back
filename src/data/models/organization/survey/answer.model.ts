interface Answer {
    surveyTodo: any;
    question: any;
    questionText: string;
    questionType: String;
    answerText: string;
    required?: boolean;
    min?: number;
    max?: number;
}

export default Answer