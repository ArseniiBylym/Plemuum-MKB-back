import BaseController from "./base.controller";
import * as StatusCodes from 'http-status-codes';
import { validate } from "../../util/input.validator";
import OrganizationManager from "../interactor/organization.interactor";

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
            .then((result) => this.respond(StatusCodes.CREATED, req, res, result))
            .catch((err) => this.handleError(err, req, res));
    }

    async getOrganizations(req: any, res: any) {
        return this.organizationManager.getOrganizations()
            .then((result) => res.status(StatusCodes.OK).send(result))
            .catch((err) => this.handleError(err, req, res));
    }

    async modifyOrganization(req: any, res: any) {
        req.checkBody('_id', 'Missing _id').notEmpty();
        req.checkBody('name', 'Missing name').notEmpty();
        req.checkBody('dbName', 'Missing dbName').notEmpty();
        req.checkBody('todoSentenceNumber', 'Missing todoSentenceNumber').notEmpty();
        req.checkBody('compassGenerationTime', 'Missing compassGenerationTime').notEmpty();

        if (!await validate(req, res)) {
            return;
        }

        return this.organizationManager.modifyOrganization(req.body)
            .then((result) => this.respond(StatusCodes.OK, req, res, result))
            .catch((err) => this.handleError(err, req, res));
    }
}