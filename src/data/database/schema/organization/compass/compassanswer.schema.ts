import { Connection, Document, Model, Schema } from 'mongoose';
import { getDatabaseManager } from "../../../../../factory/database.factory";
import CompassAnswer from "../../../../models/organization/compass/compassanswer.model";


interface CompassAnswerModel extends CompassAnswer, Document {
}

export let CompassAnswerSchema = new Schema({
    compassTodo: { required: true, type: String, index: true },
    sender: { required: true, type: String, index: true },
    sentencesAnswer: [
        {
            answer: { required: true, type: String, index: false, enum: ["SKIP", "AGREE", "DISAGREE"]},
            sentence: { required: true, type: String, index: false },
            skill: { required: true, type: String, index: false}
        }
    ]
},{
    versionKey: false,
    timestamps: true,
});

const CompassAnswerCollection = (dbName: string) => getDatabaseManager().createCollection<CompassAnswerModel>(
    dbName, "CompassAnswer", CompassAnswerSchema);


export { CompassAnswerModel, CompassAnswerCollection };