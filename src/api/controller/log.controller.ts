import * as path from "path";
import * as fs from "fs-extra";

export default class LogController {
    async getLogs(req: any, res: any) {
        const data = await fs.readFile(path.join(__dirname, '../../../log', 'info.log'), 'utf8');
        let lines = data.split('\n');
        const parsedList: any[] = [];
        lines.forEach(l => {
            if (l) parsedList.push(JSON.parse(l))
        });
        return res.send(parsedList);
    }
}