import { getTagModel, TagModel } from "../database/schema/tag.schema";
import BaseDataController from "./base.datacontroller";
import DatabaseManager from "../database/database.manager";
import { getDatabaseManager } from "../../factory/database.factory";

export default class TagDataController extends BaseDataController<TagModel> {

    constructor(databaseManager: DatabaseManager) {
        super(databaseManager, getTagModel);
    }

    public getTags(orgId: string): Promise<TagModel[]> {
        return new Promise((resolve, reject) => {
            const tagModel = getTagModel(getDatabaseManager().getConnection(), orgId);
            tagModel.find({}).lean().exec()
                .then((tags: TagModel[]) => resolve(tags))
                .catch((error) => reject(error))
        });
    }

    public saveTag(orgId: string, tag: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const tagModel = getTagModel(getDatabaseManager().getConnection(), orgId);
            new tagModel(tag).save((error, savedTag) => error ? reject(error) : resolve(savedTag));
        });
    }

}