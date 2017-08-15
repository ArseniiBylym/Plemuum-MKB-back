import GroupDataController from "../data/datacontroller/group.datacontroller";

export default class GroupController {

    private groupDataController: GroupDataController;

    constructor(groupDataController: GroupDataController) {
        this.groupDataController = groupDataController;
    }

    public createGroup(req: any, res: any, next: Function) {
        this.groupDataController.createGroup(req.params.orgId, req.body)
            .then((group) => res.status(201).send(group))
            .catch((err) => res.status(400).send({error: err}));
    }

    public getGroupById(req: any, res: any, next: Function) {
        this.groupDataController.getGroupById(req.params.orgId, req.params.groupId)
            .then((group) => res.status(200).send(group))
            .catch((err) => res.status(400).send({error: err}));
    }

}