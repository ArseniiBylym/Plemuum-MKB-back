import {Config} from "./config";

export class DevConfig implements Config {
    public get port() {
        return '5000';
    }
}