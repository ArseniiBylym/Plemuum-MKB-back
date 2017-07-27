import {Config} from "./config";

export class DevConfig implements Config {
    getPort(): String {
        return '5000';
    }
}