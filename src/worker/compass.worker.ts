import { OrganizationDataController } from "../data/datacontroller/organization.datacontroller";
import CompassManager from '../api/manager/compass.manager';
const parser = require('cron-parser');
const CronJob = require('cron').CronJob;

export default class WorkerPlenuum {

    organizationDataController: OrganizationDataController;
    job: any;

    constructor(
        frequency: string,
        organizationDataController: OrganizationDataController,
        compassManager: CompassManager){
        this.organizationDataController = organizationDataController;
        this.job = new CronJob(
            frequency,
            this.executeJob.bind(this, organizationDataController, compassManager), null);
    }

    async executeJob(organizationDataController: OrganizationDataController, compassManager: CompassManager) {
        let organizations = await organizationDataController.getOrganizations();
        for (const org of organizations){
            const interval = parser.parseExpression(org.compassGenerationTime);
            const now = new Date();
            if (interval.next().getDate() === now.getDate()){ await compassManager.autoGenerateTodo(org.name)}
        }
    }

    start(){
        this.job.start();
    }
}

