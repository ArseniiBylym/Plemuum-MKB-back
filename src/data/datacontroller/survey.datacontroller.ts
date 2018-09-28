import { SurveyCollection, SurveyModel } from "../database/schema/organization/survey/survey.schema";
import { QuestionCollection, QuestionModel } from "../database/schema/organization/survey/question.schema";
import { AnswerCollection, AnswerModel } from "../database/schema/organization/survey/answer.schema";
import { SurveyTodoCollection, SurveyTodoModel } from "../database/schema/organization/survey/surveyTodo.schema";
import { SurveyTemplateCollection, SurveyTemplateModel } from "../database/schema/organization/survey/surveyTemplate.schema";
import { ObjectId } from "bson";
import { UserModel, UserCollection } from "../database/schema/common/user.schema";
import SurveyController from "../../api/controller/survey.controller";
import { PlenuumError, ErrorType } from "../../util/errorhandler";

const SurveyDataController = {
//survey2 datacontroller
    getAllAnswersSurveyById: (orgId: string, surveyId:string): Promise<SurveyModel[]> => {
        return SurveyTodoCollection(orgId).aggregate(
            [{

                $match: {survey: new ObjectId(surveyId), isCompleted: true}
            }, {
                $lookup: {
                    from: 'answers',
                    localField: '_id',
                    foreignField: 'surveyTodo',
                    as: 'answers'
                }
            },{
                $lookup: {
                    from: 'questions',
                    localField: 'survey',
                    foreignField: 'survey',
                    as: 'questions'
                }
            },{
                $project: {
                    'questions.text':1,
                    'questions.type':1,
                    'questions.required':1,
                    'answers.answerText' : 1,
                    '_id' : 0
                }
            }
            ])
            .cursor({ async: true })
            .then(async (result:any)=>{
                const resultArr = await result.toArray();
                let formatingArr:any = [];
                let questionTextArr = ['Kérdés sorszáma'];
                questionTextArr = questionTextArr.concat(resultArr[0].questions.map((x:any) => 
                    {return `${x.text} ( ${x.type} )`+ ((x.required) ? '*': '')}));
                formatingArr.push(questionTextArr);

                for (let i = 0; resultArr.length > i; i++) {
                    let answersArr = [i+1];
                    for (let j = 0; resultArr[i].answers.length > j; j++){
                    answersArr.push(resultArr[i].answers[j].answerText)
                    }
                    formatingArr.push(answersArr)
                }
                return formatingArr;
            })
    },

    getAllSurveysByUserId: (orgId: string, userId:string): Promise<SurveyModel[]> => {
        return SurveyCollection(orgId).aggregate(
            [{
                $match: {owner: userId.toString() }
            },{
                $lookup: {
                    from: 'surveytodos',
                    localField: '_id',
                    foreignField: 'survey',
                    as: 'surveytodos'
                }
            },{
                $project: {
                    complitedSurveyTodos: {
                       $size : {
                        $filter: {
                          input: "$surveytodos",
                          as: "surveytodo",
                          cond: { "$eq" : ["$$surveytodo.isCompleted", true]  }
                       }
                    }
                    },
                    allSurveyTodos: {$size: "$surveytodos"},
                    title : 1,
                    expiritDate : 1,
                    createdAt : 1
                 }
            },{
                $sort : {createdAt:-1}
            }
            ])
            .exec() as any;
    },

    createSurveyDynamic: (orgId: string, survey: SurveyModel): Promise<SurveyModel> => {
        let newSurvey : SurveyModel;
        return new (SurveyCollection(orgId))(survey).save()
        .then((result) => {
            newSurvey = result;
            if (survey.questions) {
                survey.questions.forEach(function(value,index,array){
                    array[index].survey = newSurvey._id;
                    if (value.type && value.type === 'text' ) value.max = 500 
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

    getSurveyDetail: (orgId: string, surveyId: string): Promise<SurveyModel> => {
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
        },{
            $lookup: {
                from: 'surveytodos',
                localField: '_id',
                foreignField: 'survey',
                as: 'surveytodos'
            }
        },{
            $project: {
                complitedSurveyTodos: {
                   $size : {
                    $filter: {
                      input: "$surveytodos",
                      as: "surveytodo",
                      cond: { "$eq" : ["$$surveytodo.isCompleted", true]  }
                   }
                }
                },
                allSurveyTodos: {$size: "$surveytodos"},
                title : 1,
                description : 1,
                expiritDate : 1,
                createdAt : 1,
                updatedAt : 1,
                type : 1,
                questions : 1,
                respondents : 1

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

    //surveyTemplate

    getDefaultSurveyTemplate: (orgId: string): Promise<SurveyTemplateModel[]> => {
        return SurveyTemplateCollection(orgId).find({visible : 'all'}).sort({createdAt:-1}).lean().exec() as Promise<SurveyTemplateModel[]>;
    },

    getDefaulAndHRtSurveyTemplate: (orgId: string): Promise<SurveyTemplateModel[]> => {
        return SurveyTemplateCollection(orgId).find({$or : [{visible : 'all'}, {visible : 'HR'}]}).sort({createdAt:-1}).lean().exec() as Promise<SurveyTemplateModel[]>;
    },

    createSurveyTemplate: (orgId: string, surveyTemplate: SurveyTemplateModel): Promise<SurveyTemplateModel> => {
        return new (SurveyTemplateCollection(orgId))(surveyTemplate).save();
    },

    deleteSurveyTemplateById: (orgId: string, surveyTemplateId: string): Promise<SurveyTemplateModel> => {
        return SurveyTemplateCollection(orgId).remove({ _id: surveyTemplateId })
        .lean().exec() as Promise<SurveyTemplateModel>;
    },

    // For Plenuum Admin

    getAllUserWhoUncompletedSurvey: (orgId: string, surveyId:string): Promise<SurveyModel[]> => {
        return SurveyTodoCollection(orgId).aggregate(
            [{
                $match: {survey: new ObjectId(surveyId), isCompleted:false}
            }
            ])
            .cursor({ async: true })
            .then(async (result:any)=>{
                const resultArr = await result.toArray();
                let usersId = [];
                const unnecessaryProp:any = ["_id", "updatedAt", "createdAt", "survey", "respondent", "isCompleted"];
                let usersData = [];

                usersId = resultArr.map((x:any) => {return x.respondent});
                // get user data
                usersData = await UserCollection()
                .find({_id: {$in: usersId}}, {_id:1, firstName:1, lastName:1, email:1});
        
                for (let i = 0; i<resultArr.length; i++) {
                        resultArr[i].employeeId = usersData[i]._id.toString();
                        resultArr[i].employeeFirstName = usersData[i].firstName;
                        resultArr[i].employeeLastName = usersData[i].lastName;
                        resultArr[i].employeeEmail = usersData[i].email;
                
                    for (let key in resultArr[i]){
                        if (unnecessaryProp.includes(key)){
                            delete resultArr[i][key]
                        }
                    }
                }
                return resultArr;
            })
    },
    getAllAnswersSurvey: (orgId: string, surveyId:string): Promise<SurveyModel[]> => {
        return SurveyTodoCollection(orgId).aggregate(
            [{

                $match: {survey: new ObjectId(surveyId)}
            }, {
                $lookup: {
                    from: 'answers',
                    localField: '_id',
                    foreignField: 'surveyTodo',
                    as: 'answers'
                }
            },{
                $project: {
                    'answers._id': 0,
                    'answers.updatedAt': 0,
                    'answers.question': 0,
                    'answers.questionText': 0,
                    'answers.required': 0,
                    'answers.surveyTodo': 0,
                    'answers.max': 0,
                    'answers.min': 0,
                    'answers.createdAt': 0,
                }
            }
            ])
            .cursor({ async: true })
            .then(async (result:any)=>{
                const resultArr = await result.toArray();
                let userData;
                let managerData;
                let unnecessaryProp:any = ["answers","survey", "_id", "respondent",  "managerData", "manager"];
                // get user and manager data
                for (let i = 0; i<resultArr.length; i++) {
                    try {
                        userData = await UserCollection()
                            .findById(resultArr[i].respondent, {_id:1, firstName:1, lastName:1, email:1});
                        if (userData) {
                            resultArr[i].employeeId = userData._id.toString();
                            resultArr[i].employeeFirstName = userData.firstName;
                            resultArr[i].employeeLastName = userData.lastName;
                            resultArr[i].employeeEmail = userData.email;
                        }

                        managerData  =resultArr[i].managerData = await UserCollection()
                            .findById(resultArr[i].manager,{_id:1, firstName:1, lastName:1, email:1});
                        if (managerData){
                            resultArr[i].managerId = managerData._id.toString();
                            resultArr[i].managerFirstName = managerData.firstName;
                            resultArr[i].managerLastName = managerData.lastName;
                            resultArr[i].managerEmail = managerData.email;
                        }

                        for (let j = 0; j<resultArr[i].answers.length; j++){
                            resultArr[i][`Answer string ${j+1}`] = resultArr[i].answers[j].answerText;
                        }
                        for (let key in resultArr[i]){
                            if (unnecessaryProp.includes(key)){
                                delete resultArr[i][key]
                            }
                        }
                    } catch (e) {
                    }
                }
                return resultArr;
            })
    },

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
    getAllSurveyTodos: (orgId: string, userId:string): Promise<SurveyTodoModel[]> => {
        return SurveyTodoCollection(orgId).find({ respondent:userId })
        .populate({ path: 'survey', model: SurveyCollection(orgId) , select:'_id title',})
        .sort({createdAt:-1})
        .lean()
        .exec() as Promise<SurveyTodoModel[]>;
    },

    getAllSurveysTodo: (orgId: string, userId:string): Promise<SurveyTodoModel[]> => {
        return SurveyTodoCollection(orgId).find({respondent:userId,isCompleted:false })
        .populate({ path: 'survey', model: SurveyCollection(orgId) , select:'_id title type expiritDate owner',})
        .sort({createdAt:-1})
        .lean()
        .exec() as Promise<SurveyTodoModel[]>;
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
        .populate({ path: 'survey', model: SurveyCollection(orgId) , select:'_id title description',}).lean().exec()
        .then((result) => {
            if(!result) {
                throw new PlenuumError('Survey to do was not found', ErrorType.NOT_FOUND);
            }
            surveyTodo = result as SurveyTodoModel;
            return QuestionCollection(orgId)
            .aggregate([{ 
                    $match: {survey: surveyTodo.survey._id}
                }, {
                    $project: {
                        type: 1,
                        text: 1,
                        required: 1,
                        min: 1,
                        max: 1,
                        answerValues: 1
                    }
                }, {
                    $lookup: {
                        from: 'answers',
                        localField: '_id',
                        foreignField: 'question',
                        as: 'answer'
                    }
                }, {
                    "$addFields": {
                        "answer": {
                            "$arrayElemAt": [
                                {
                                    "$filter": {
                                        "input": "$answer",
                                        "as": "answ",
                                        "cond": {
                                            "$eq": [ "$$answ.surveyTodo", surveyTodo._id ]
                                        }
                                    }
                                }, 0
                            ]
                        }
                    }
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
        })
        .catch((error) => {
            throw new PlenuumError('Survey to do was not found', ErrorType.NOT_FOUND);
        });
    },

    saveSurveyTodo: (orgId: string, surveyTodo: SurveyTodoModel): Promise<any> => {
        if (surveyTodo.isCompleted) {
            surveyTodo.completedAt = new Date();
        }
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
                    completedAt: surveyTodo.completedAt
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

    findManager: (orgId: string, keyword?: string): Promise<UserModel[]> => {
        if(!keyword) keyword = '';
        return UserCollection()
            .find({$and: [
                    {$or: [
                        {orgIds: {$eq: orgId}},
                        {orgId: {$eq: orgId}},
                    ]},
                    {admin: false}, 
                     {$or: [
                        {firstName: {$regex: keyword, $options: 'i'}},
                        {lastName: {$regex: keyword, $options: 'i'}}
                    ]},
            ]})
            .lean()
            .exec() as Promise<UserModel[]>;
    },
};

export default SurveyDataController;