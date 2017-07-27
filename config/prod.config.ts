import {Config} from "./config";

export class ProdConfig implements Config {
    public get port() {
        return '1234';
    }
}