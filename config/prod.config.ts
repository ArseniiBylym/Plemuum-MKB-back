import {Config} from "./config";

export class ProdConfig implements Config {
    getPort(): String {
        return '8081'
    }
}