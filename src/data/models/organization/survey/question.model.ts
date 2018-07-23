interface Question {
    survey: any;
    text: string;
    required?: boolean;
    min?: number;
    max?: number;
}

export default Question