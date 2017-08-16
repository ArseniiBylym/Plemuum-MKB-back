import { TagCollection } from "../database/schema/tag.schema";

interface TagDataController {
    getTags: (orgId: string) => Promise<any>
    saveTag: (orgId: string, tag: any) => Promise<any>
}

const tagDataController: TagDataController = {

    getTags(orgId: string): Promise<any> {
        return TagCollection(orgId).find({}).lean().exec()
    },

    saveTag(orgId: string, tag: any): Promise<any> {
        return new (TagCollection(orgId))(tag).save();
    }
};

export { tagDataController, TagDataController}