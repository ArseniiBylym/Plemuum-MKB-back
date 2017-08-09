import { TagCollection, TagModel } from "../database/schema/tag.schema";
import BaseDataController from "./base.datacontroller";
import DatabaseManager from "../database/database.manager";

export default class TagDataController extends BaseDataController<TagModel> {

    constructor(databaseManager: DatabaseManager) {
        super(databaseManager, TagCollection);
    }

    public getTags(orgId: string): Promise<TagModel[]> {
        return new Promise((resolve, reject) => {
            TagCollection(orgId).find({}).lean().exec()
                .then((tags: TagModel[]) => resolve(tags))
                .catch((error) => reject(error))
        });
    }

    public saveTag(orgId: string, tag: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const tagModel = TagCollection(orgId);
            new tagModel(tag).save((error, savedTag) => error ? reject(error) : resolve(savedTag));
        });
    }

}