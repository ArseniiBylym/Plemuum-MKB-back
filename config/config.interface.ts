import FirebaseConfig from "./firebase/firebase.config";

export interface Config {
    env: string;
    port: string;
    mongoUrl: string;
    adminPwd: string;
    plenuumBotEmail: string;
    plenuumBotPass: string;
    debugMode: boolean;
    firebaseConfig: FirebaseConfig;
    workerTime: string;
    webappDomain: string;
    adminDomain: string;
}