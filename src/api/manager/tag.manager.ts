import { TagDataController } from "../../data/datacontroller/tag.datacontroller";
import { PlenuumError, ErrorType } from "../../util/errorhandler";

export default class TagManager {

    private tagDataController: TagDataController;

    constructor(tagDataController: TagDataController) {
        this.tagDataController = tagDataController;
    }

    async addNewTag(orgId: string, tag: any) {
        tag.isActive = true;
        const tags = await this.tagDataController.getTags(orgId);
        if (tags.findIndex((element: any) => element.title.toLowerCase() === tag.title.toLowerCase()) !== -1) {
            throw new PlenuumError("This tag already exists", ErrorType.NOT_ALLOWED);
        }
        tag.order = tags.length + 1;
        return this.tagDataController.saveTag(orgId, tag);
    }

    async getTags(orgId: string) {
        return this.tagDataController.getTags(orgId);
    }

}