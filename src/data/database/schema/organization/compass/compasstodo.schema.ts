import CompassTodo from "../../../../models/organization/compass/compasstodo.model";
import { Connection, Document, Model, Schema } from 'mongoose';
import { getDatabaseManager } from "../../../../../factory/database.factory";

interface CompassTodoModel extends CompassTodo, Document {
}

export let CompassTodoSchema = new Schema({
    aboutUser: {required: true, type: String, index: true},
    recipientId: {required: true, type: String, index: true},
    sender: {required: true, type: String, index: false},
    message: {required: true, type: String, index: false},
    sentences: [
        {
            message: {required: true, type: String, index: false },
            skillName: { required: true, type: String, index: false}
        }
    ]
}, {
    versionKey: false,
    timestamps: true,
});

const CompassTodoCollection = (dbName: string) => getDatabaseManager().createCollection<CompassTodoModel>(
    dbName, "CompassTodo", CompassTodoSchema);


export { CompassTodoModel, CompassTodoCollection };