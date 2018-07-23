interface SurveyTodo {
    manager: string;
    respondent: string;
    survey: any;
    isCompleted: boolean;
    completedAt?: Date;
}

export default SurveyTodo