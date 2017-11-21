import * as path from "path";
import * as fs from "fs-extra";

export default class LogController {
    async getLogs(req: any, res: any) {
        const currentDateString = new Date().toISOString().substr(0, 10);
        const data = await fs.readFile(path.join(__dirname, '../../../log', `info-${currentDateString}.log`), 'utf8');
        let lines = data.split('\n');
        let parsedList: any[] = [];
        lines.forEach(l => {
            if (l) parsedList.push(JSON.parse(l));
        });
        if (req.query.filter) {
            const filterDate = new Date(req.query.filter);
            parsedList = parsedList.filter((l) => new Date(l.timestamp) >= filterDate);
        }
        return res.send(parsedList);
    }
}