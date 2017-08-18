import { SkillCollection } from "../database/schema/organization/compass/skill.schema";
import { CompassTodoCollection } from "../database/schema/organization/compass/compasstodo.schema";

const CompassDataController = {
    getAllSkills: (orgId: string): Promise<any> => {
        return SkillCollection(orgId).find({}).lean().exec();
    },

    saveCompassTodo: (orgId: string, newTodo: any): Promise<any> => {
        return new (CompassTodoCollection(orgId))(newTodo).save();
    }
};

export default CompassDataController;