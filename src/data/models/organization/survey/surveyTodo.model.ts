interface SurveyTodo {
    manager?: string;
    respondent: string;
    survey: any;
    isCompleted: boolean;
    completedAt?: Date;
    surveyType? : Number;
}

export default SurveyTodo