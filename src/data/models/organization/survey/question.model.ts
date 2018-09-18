interface Question {
    type?: number;
    answerValues?: string [];
    survey: any;
    text: string;
    required?: boolean;
    min?: number;
    max?: number;
}

export default Question