import CompassTodo from "../../../../models/organization/compass/compasstodo.model";
import { Connection, Document, Model, Schema } from 'mongoose';
import { getDatabaseManager } from "../../../../../factory/database.factory";
import { SentenceSchema, SkillSchema } from "./skill.schema";

interface CompassTodoModel extends CompassTodo, Document {
}

export let CompassTodoSchema = new Schema({
    about: {required: true, type: String, index: true},
    recipient: {required: true, type: String, index: true},
    createdBy: {required: true, type: String, index: false},
    questions: [
        {
            sentence: {required: true, type: SentenceSchema, index: false },
            skill: { required: true, type: SkillSchema, index: false}
        }
    ]
}, {
    versionKey: false,
    timestamps: true,
});

const CompassTodoCollection = (dbName: string) => getDatabaseManager().createCollection<CompassTodoModel>(
    dbName, "CompassTodo", CompassTodoSchema);


export { CompassTodoModel, CompassTodoCollection };