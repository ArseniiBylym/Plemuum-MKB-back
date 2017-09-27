import BaseController from "./base.controller";
import OrganizationManager from "../manager/organization.manager";
import * as StatusCodes from 'http-status-codes';
import { validate } from "../../util/input.validator";

export default class OrganizationController extends BaseController {

    private organizationManager: OrganizationManager;

    constructor(organizationManager: OrganizationManager) {
        super();
        this.organizationManager = organizationManager;
    }

    async createOrganization(req: any, res: any) {
        req.checkBody('name', 'Missing name').notEmpty();
        req.checkBody('dbName', 'Missing dbName').notEmpty();
        req.checkBody('todoSentenceNumber', 'Missing todoSentenceNumber').notEmpty();
        req.checkBody('compassGenerationTime', 'Missing compassGenerationTime').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        return this.organizationManager.createOrganization(req.body)
            .then((savedOrganization) => res.status(StatusCodes.CREATED).send(savedOrganization))
            .catch((err) => BaseController.handleError(err, res));
    }
}