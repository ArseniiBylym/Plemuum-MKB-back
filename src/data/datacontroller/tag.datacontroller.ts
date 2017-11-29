import { TagCollection } from "../database/schema/organization/tag.schema";

interface TagDataController {
    getTags: (orgId: string) => Promise<any>
    getTagById: (orgId: string, tagId: string) => Promise<any>
    saveTag: (orgId: string, tag: any) => Promise<any>
    updateTag: (orgId: string, tag: any) => Promise<any>
}

const tagDataController: TagDataController = {

    getTags(orgId: string): Promise<any> {
        return TagCollection(orgId).find({}).lean().exec();
    },

    getTagById(orgId: string, tagId: string): Promise<any> {
        return TagCollection(orgId).findById(tagId).lean().exec();
    },

    saveTag(orgId: string, tag: any): Promise<any> {
        return new (TagCollection(orgId))(tag).save();
    },

    updateTag(orgId: string, tag: any): Promise<any> {
        const id = tag._id;
        delete tag._id;
        return TagCollection(orgId).findByIdAndUpdate(id, tag).lean().exec();
    }
};

export { tagDataController, TagDataController }