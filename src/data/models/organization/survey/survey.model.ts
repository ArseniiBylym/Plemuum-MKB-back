interface Survey {
    type?:number;
    description?:string;
    respondents?:any[];
    expiritDate?: Date;
    owner: string;
    title?: string;
    numberOfQuestions?: number;
    sendingOutAt?: Date;
}

export default Survey