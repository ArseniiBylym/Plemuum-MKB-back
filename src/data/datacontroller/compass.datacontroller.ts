import { SkillCollection, SkillModel } from "../database/schema/organization/compass/skill.schema";
import { CompassTodoCollection, CompassTodoModel } from "../database/schema/organization/compass/compasstodo.schema";
import CompassAnswer from "../models/organization/compass/compassanswer.model";
import { CompassAnswerCollection } from "../database/schema/organization/compass/compassanswer.schema";
import Skill from "../models/organization/compass/skill.model";

const CompassDataController = {

    answeredCompassTodos: (orgId: string, userId: string): Promise<any> => {
        return CompassTodoCollection(orgId).update({about: userId, answered : false},  { $set:{answered : true}}, {"multi": true}).exec()
        .then((result) => {
            return result;
        });
    },

    getAllSkills: (orgId: string): Promise<SkillModel[]> => {
        return SkillCollection(orgId).find({}).lean().exec() as Promise<SkillModel[]>;
    },

    getSkillById: (orgId: string, skillId: string): Promise<SkillModel> => {
        return SkillCollection(orgId).findById(skillId).lean().exec() as Promise<SkillModel>
    },

    getSkillsByIds: (orgId: string, skillIds: string[]): Promise<SkillModel[]> => {
        return SkillCollection(orgId).find({_id: {$in: skillIds}}).lean().exec() as Promise<SkillModel[]>;
    },

    getTodoById: (orgId: string, todoId: string): Promise<CompassTodoModel> => {
        return CompassTodoCollection(orgId).findById(todoId).lean().exec() as Promise<CompassTodoModel>
    },

    getTodosForOwner: (orgId: string, ownerId: string): Promise<CompassTodoModel[]> => {
        return CompassTodoCollection(orgId).find({
            owner: ownerId,
            answered: false
        }).lean().exec() as Promise<CompassTodoModel[]>
    },

    updateCompassTodo: (orgId: string, updatedTodo: any): Promise<any> => {
        const id = updatedTodo._id;
        delete updatedTodo._id;
        return CompassTodoCollection(orgId).findByIdAndUpdate(id, updatedTodo).lean().exec();
    },

    saveCompassTodo: (orgId: string, newTodo: any): Promise<any> => {
        return new (CompassTodoCollection(orgId))(newTodo).save().then(
            (todo) => CompassTodoCollection(orgId).findById(todo._id).lean().exec());
    },

    saveCompassAnswer: (orgId: string, data: CompassAnswer): Promise<CompassAnswer> => {
        return new (CompassAnswerCollection(orgId))(data).save()
            .then((savedAnswer) => CompassAnswerCollection(orgId).findById(savedAnswer._id)
                .lean().exec() as Promise<CompassAnswer>)
    },

    saveSkill: (orgId: string, skill: Skill): Promise<SkillModel> => {
        return new (SkillCollection(orgId))(skill).save();
    },

    createOrUpdateSkill: (orgId: string, skill: any): Promise<any> => {
        if (skill._id) {
            const skillId = skill._id;
            delete skill._id;
            return SkillCollection(orgId).update({_id: skillId}, skill).exec()
                .then((result) => {
                    if (result.nModified === 0) {
                        throw new Error('Group was not found');
                    }
                    return SkillCollection(orgId).findById(skillId).lean().exec();
                });
        } else {
            return new (SkillCollection(orgId))(skill).save();
        }
    }
};

export default CompassDataController;