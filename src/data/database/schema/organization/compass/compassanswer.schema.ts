import { Connection, Document, Model, Schema } from 'mongoose';
import { getDatabaseManager } from "../../../../../factory/database.factory";
import { CompassAnswer } from "../../../../../../compassanswer.model";


interface CompassAnswerModel extends CompassAnswer, Document {
}

export let CompassAnswerSchema = new Schema({
    compassTodoId: { required: true, type: String, index: true },
    senderId: { required: true, type: String, index: true },
    recipientId: { required: true, type: String, index: true },
    areConnected: { required: true, type: Boolean, index: true },
    sentencesAnswer: [
        {
            answer: { required: true, type: String, index: false, enum: ["SKIP", "AGREE", "DISAGREE"]},
            message: { required: true, type: String, index: false },
            competenceName: { required: true, type: String, index: false}
        }
    ]
},{
    versionKey: false,
    timestamps: true,
});

const CompassAnswerCollection = (dbName: string) => getDatabaseManager().createCollection<CompassAnswerModel>(
    dbName, "CompassAnswer", CompassAnswerSchema);


export { CompassAnswerModel, CompassAnswerCollection };