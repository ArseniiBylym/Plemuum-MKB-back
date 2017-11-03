import { TagDataController } from "../../data/datacontroller/tag.datacontroller";
import { ErrorType, PlenuumError } from "../../util/errorhandler";

export default class TagManager {

    private tagDataController: TagDataController;

    constructor(tagDataController: TagDataController) {
        this.tagDataController = tagDataController;
    }

    async addNewTag(orgId: string, tag: any) {
        if (!tag._id) {
            tag.isActive = !!tag.isActive;
            const tags = await this.tagDataController.getTags(orgId);
            if (tags.findIndex((element: any) => element.title.toLowerCase() === tag.title.toLowerCase()) !== -1) {
                throw new PlenuumError("This tag already exists", ErrorType.NOT_ALLOWED);
            }
            tag.order = tags.length + 1;
            return this.tagDataController.saveTag(orgId, tag);
        } else {
            const existingTag = await this.tagDataController.getTagById(orgId, tag._id);
            if (!existingTag) {
                throw new PlenuumError("Tag doesn't exist", ErrorType.NOT_ALLOWED);
            }
            return this.tagDataController.updateTag(orgId, tag);
        }
    }

    async getTags(orgId: string) {
        return this.tagDataController.getTags(orgId);
    }

}