import { SkillCollection, SkillModel } from "../database/schema/organization/compass/skill.schema";
import { CompassTodoCollection, CompassTodoModel } from "../database/schema/organization/compass/compasstodo.schema";
import CompassAnswer from "../models/organization/compass/compassanswer.model";
import { CompassAnswerCollection } from "../database/schema/organization/compass/compassanswer.schema";
import Skill from "../models/organization/compass/skill.model";

const CompassDataController = {

    getAllSkills: (orgId: string): Promise<SkillModel[]> => {
        return SkillCollection(orgId).find({}).lean().exec() as Promise<SkillModel[]>;
    },

    getSkillById: (orgId: string, skillId: string): Promise<SkillModel> => {
        return SkillCollection(orgId).findById(skillId).lean().exec() as Promise<SkillModel>
    },

    getSkillsByIds: (orgId: string, skillIds: string[]): Promise<SkillModel[]> => {
        return SkillCollection(orgId).find({$in: {_id: skillIds}}).lean().exec() as Promise<SkillModel[]>;
    },

    getTodoById: (orgId: string, todoId: string): Promise<CompassTodoModel> => {
        return CompassTodoCollection(orgId).findById(todoId).lean().exec() as Promise<CompassTodoModel>
    },

    saveCompassTodo: (orgId: string, newTodo: any): Promise<any> => {
        return new (CompassTodoCollection(orgId))(newTodo).save();
    },

    saveCompassAnswer: (orgId: string, data: CompassAnswer): Promise<CompassAnswer> => {
        return new (CompassAnswerCollection(orgId))(data).save()
            .then((savedAnswer) => CompassAnswerCollection(orgId).findById(savedAnswer._id)
                .lean().exec() as Promise<CompassAnswer>)
    },

    saveSkill: (orgId: string, skill: Skill): Promise<SkillModel> => {
        return new (SkillCollection(orgId))(skill).save();
    },

    updateSkill: (orgId: string, skill: any): Promise<boolean> => {
        return SkillCollection(orgId).update({_id: skill._id}, skill).exec()
            .then((result) => {
                if (result.nModified === 0) {
                    throw new Error('Group was not found');
                }
                return true;
            });
    }
};

export default CompassDataController;