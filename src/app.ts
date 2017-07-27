import * as express from 'express'
import {Express} from 'express'

const controllers = require('./controllers/controllers');

class App {
    public express: Express;

    constructor() {
        this.express = express();
        controllers.set(this.express);
    }
}

export default new App().express