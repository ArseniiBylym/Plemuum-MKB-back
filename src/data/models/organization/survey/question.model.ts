interface Question {
    type?: string;
    answerValues?: string [];
    survey: any;
    text: string;
    required?: boolean;
    min?: number;
    max?: number;
}

export default Question