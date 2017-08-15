import { TagCollection } from "../database/schema/tag.schema";

export default class TagDataController {

    public getTags(orgId: string): Promise<any> {
        return TagCollection(orgId).find({}).lean().exec()
    }

    public saveTag(orgId: string, tag: any): Promise<any> {
        return new (TagCollection(orgId))(tag).save();
    }
}