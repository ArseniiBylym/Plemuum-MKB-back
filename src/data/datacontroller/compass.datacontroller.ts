import { SkillCollection } from "../database/schema/organization/compass/skill.schema";
import { CompassTodoCollection } from "../database/schema/organization/compass/compasstodo.schema";
import CompassAnswer from "../models/organization/compass/compassanswer.model";
import { CompassAnswerCollection } from "../database/schema/organization/compass/compassanswer.schema";

const CompassDataController = {
    getAllSkills: (orgId: string): Promise<any> => {
        return SkillCollection(orgId).find({}).lean().exec();
    },

    saveCompassTodo: (orgId: string, newTodo: any): Promise<any> => {
        return new (CompassTodoCollection(orgId))(newTodo).save();
    },

    saveCompassAnswerWith: (orgId: string, data: CompassAnswer): Promise<CompassAnswer> => {
        return new (CompassAnswerCollection(orgId))(data).save()
    }
};

export default CompassDataController;