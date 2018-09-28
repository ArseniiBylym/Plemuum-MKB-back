interface SurveyTemplate {
    type?:number;
    templateTitle: string;
    visible: string [];
    description?:string;
    respondents?:any[];
    expiritDate?:Date;
    owner:string;
    title?:string;
    numberOfQuestions?:number;
    createdAt?:Date;
    surveyType?:number;
    questions?:any[];
}

export default SurveyTemplate