import { SkillCollection, SkillModel } from "../database/schema/organization/compass/skill.schema";
import { CompassTodoCollection } from "../database/schema/organization/compass/compasstodo.schema";
import CompassAnswer from "../models/organization/compass/compassanswer.model";
import { CompassAnswerCollection } from "../database/schema/organization/compass/compassanswer.schema";
import Skill from "../models/organization/compass/skill.model";

const CompassDataController = {
    getAllSkills: (orgId: string): Promise<any> => {
        return SkillCollection(orgId).find({}).lean().exec();
    },

    getSkillById: (orgId: string, skillId: string): Promise<SkillModel> => {
        return SkillCollection(orgId).findById(skillId).lean().exec() as Promise<SkillModel>
    },

    saveCompassTodo: (orgId: string, newTodo: any): Promise<any> => {
        return new (CompassTodoCollection(orgId))(newTodo).save();
    },

    saveCompassAnswer: (orgId: string, data: CompassAnswer): Promise<CompassAnswer> => {
        return new (CompassAnswerCollection(orgId))(data).save();
    },

    saveSkill: (orgId: string, skill: Skill): Promise<SkillModel> => {
        return new (SkillCollection(orgId))(skill).save();
    },

    updateSkill: (orgId: string, skill: any): Promise<SkillModel> => {
        return SkillCollection(orgId).update({_id: skill._id}, skill).lean().exec() as Promise<SkillModel>
    }

};

export default CompassDataController;