import GroupDataController from "../data/datacontroller/group.datacontroller";

export default class GroupController {

    public createGroup(req: any, res: any, next: Function) {
        GroupDataController.createGroup(req.params.orgId, req.body)
            .then((group) => res.status(201).send(group))
            .catch((err) => res.status(400).send({error: err}));
    }

    public getGroupById(req: any, res: any, next: Function) {
        GroupDataController.getGroupById(req.params.orgId, req.params.groupId)
            .then((group) => res.status(200).send(group))
            .catch((err) => res.status(400).send({error: err}));
    }

    public getUserGroups(req: any, res: any, next: Function) {
        GroupDataController.getUserGroups(req.params.orgId, req.params.userId)
            .then((groups) => res.status(200).send(groups))
            .catch((err) => res.status(400).send({error: err}));
    }

    public putUserIntoGroup(req: any, res: any, next: Function) {
        GroupDataController.putUserIntoGroup(req.params.orgId, req.body.userId, req.params.groupId)
            .then((group) => res.status(200).send({success: "User has been added"}))
            .catch((err) => res.status(400).send({error: err}))
    }

    public removeUserFromGroup(req: any, res: any, next: Function) {
        GroupDataController.removeUserFromGroup(req.params.orgId, req.body.userId, req.params.groupId)
            .then((group) => res.status(200).send({success: "User has been removed"}))
            .catch((err) => res.status(400).send({error: err}))
    }
}