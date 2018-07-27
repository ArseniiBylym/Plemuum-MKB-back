import { SurveyCollection, SurveyModel } from "../database/schema/organization/survey/survey.schema";
import { QuestionCollection, QuestionModel } from "../database/schema/organization/survey/question.schema";
import { AnswerCollection, AnswerModel } from "../database/schema/organization/survey/answer.schema";
import { SurveyTodoCollection, SurveyTodoModel } from "../database/schema/organization/survey/surveyTodo.schema";
import { ObjectId } from "bson";
import { UserModel, UserCollection } from "../database/schema/common/user.schema";
import SurveyController from "../../api/controller/survey.controller";

const SurveyDataController = {
    // For Plenuum Admin
    getAllSurveys: (orgId: string): Promise<SurveyModel[]> => {
        return SurveyCollection(orgId).find({}).sort({createdAt:-1}).lean().exec() as Promise<SurveyModel[]>;
    },

    getSurvey: (orgId: string, surveyId: string): Promise<SurveyModel> => {
        return SurveyCollection(orgId).aggregate(
        [{
            $match: { _id: new ObjectId(surveyId) }
        },
        {
            $lookup: {
                from: 'questions',
                localField: '_id',
                foreignField: 'survey',
                as: 'questions'
            }
        }])
        .cursor({ async: true })
        .exec()
        .then((result:any) => {
            return result.toArray();
        })
        .then((result:any) => {
            return result[0];
        });
    },

    createSurvey: (orgId: string, survey: SurveyModel): Promise<SurveyModel> => {
        let newSurvey : SurveyModel;
        return new (SurveyCollection(orgId))(survey).save()
        .then((result) => {
            newSurvey = result;
            if (survey.questions) {
                survey.questions.forEach(function(value,index,array){
                    array[index].survey = newSurvey._id;
                });
            };
            return QuestionCollection(orgId).insertMany(survey.questions);
        })
        .then((result) => {
            if (survey.questions) {
                if (!(result && result.length == survey.questions.length)) {
                    throw new Error('Something went wrong wen create survey.');
                }
            };
            return newSurvey;
        });
    },

    getQuestion: (orgId: string, questionId: string): Promise<QuestionModel> => {
        return QuestionCollection(orgId).findById(questionId).lean().exec() as Promise<QuestionModel>;
    },

    updateQuestion: (orgId: string, question: QuestionModel): Promise<QuestionModel | null> => {
        return QuestionCollection(orgId).findByIdAndUpdate(question._id, question, {new: true}).exec()
        .then((result) => {
            return result;
        });
    },

    getEmployees: (orgId: string) : Promise<UserModel[]> => {
        return UserCollection()
        .find({$and: [ {orgIds: {$eq: orgId}}, {admin: false} ]})
        .lean()
        .exec() as Promise<UserModel[]>;
    },

    // For MKB Employee
    getAllSurveysTodo: (orgId: string, userId:string): Promise<SurveyTodoModel[]> => {
        return SurveyTodoCollection(orgId).find({respondent:userId,isCompleted:false }).sort({createdAt:-1}).lean().exec() as Promise<SurveyTodoModel[]>;
    },

    getSurveysAfterDate: (orgId: string, date: Date): Promise<SurveyModel[]> => {
        return SurveyCollection(orgId).find({createdAt: {$gt: date}}).lean().exec() as Promise<SurveyModel[]>;
    },

    createSurveyTodo: (orgId: string, surveyTodo: SurveyTodoModel): Promise<SurveyTodoModel> => {
        return new (SurveyTodoCollection(orgId))(surveyTodo).save();
    },

    createManySurveyTodo: (orgId: string, surveysTodo: SurveyTodoModel[]): Promise<SurveyTodoModel[]> => {
        return SurveyTodoCollection(orgId).insertMany(surveysTodo);
    },

    getSurveyTodo: (orgId: string, surveyTodoId:string, userId:string): Promise<any> => {
        let surveyTodo : SurveyTodoModel;

        return SurveyTodoCollection(orgId)
        .findOne({ _id: surveyTodoId, respondent: userId })
        .populate({ path: 'survey', model: SurveyCollection(orgId) , select:'_id title',}).lean().exec()
        .then((result) => {
            if(!result) {
                throw new Error('Survey to do was not found');
            }
            surveyTodo = result as SurveyTodoModel;
            return QuestionCollection(orgId)
            .aggregate([{ 
                    $match: {survey: surveyTodo.survey._id}
                }, {
                    $project: {
                        text: 1,
                        required: 1,
                        min: 1,
                        max: 1,
                    }
                }, {
                    $lookup: {
                        from: 'answers',
                        localField: '_id',
                        foreignField: 'question',
                        as: 'answer'
                    }
                }, {
                    $unwind: { path:'$answer', preserveNullAndEmptyArrays: true }
                }, {
                    $match: { $or: [{ "answer" : { $exists : false } }, {"answer.surveyTodo": surveyTodo._id}] }
                }, {
                    $project: {
                        'answer.surveyTodo': 0,
                        'answer.question': 0,
                        'answer.createdAt': 0,
                        'answer.updatedAt': 0,
                    }
                },
            ])
            .cursor({ async: true })
            .exec();
        })
        .then((result) => {
            return result.toArray();
        })
        .then((result) => {
            return { surveyTodo, questions: result }
        });
    },

    saveSurveyTodo: (orgId: string, surveyTodo: SurveyTodoModel): Promise<any> => {
        return AnswerCollection(orgId).remove({ surveyTodo: surveyTodo._id }).exec()
        .then(() => {
            if (surveyTodo && surveyTodo.answers) {
                surveyTodo.answers.forEach(function(value,index,array){
                    array[index].surveyTodo = surveyTodo._id;
                });
            };
            return AnswerCollection(orgId).insertMany(surveyTodo.answers)
        })
        .then(() => {
            return SurveyTodoCollection(orgId).update({
                _id:surveyTodo._id}, {
                    manager: surveyTodo.manager,
                    isCompleted: surveyTodo.isCompleted,
                }).exec()
        })
        .then((result) => {
            if (!(result && result.n == result.ok)) {
                throw new Error('Something went wrong wen save survey to do.');
            }
            return surveyTodo;
        });
    },

    setSurveyTodoManager: (orgId: string, surveyTodoId: string, managerId: string): Promise<SurveyTodoModel | null> => {
        return SurveyTodoCollection(orgId).findByIdAndUpdate(surveyTodoId, {manager: managerId}, {new: true}).exec()
        .then((result) => {
            return result;
        });
    },

    findManager: (orgId: string, keyword: string): Promise<UserModel[]> => {
        if(!keyword) keyword = '';
        return UserCollection()
            .find({$and: [
                    {orgIds: {$eq: orgId}},
                    {admin: false}, 
                     {$or: [
                        {firstName: {$regex: keyword, $options: 'i'}},
                        {lastName: {$regex: keyword, $options: 'i'}}
                    ]},
            ]})
            .limit(10)
            .lean()
            .exec() as Promise<UserModel[]>;
    },
};

export default SurveyDataController;