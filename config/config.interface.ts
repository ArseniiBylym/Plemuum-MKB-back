import FirebaseConfig from "./firebase.config";

export interface Config {
    port: string;
    mongoUrl: string;
    adminPwd: string;
    plenuumBotEmail: string;
    plenuumBotPass: string;
    debugMode: boolean;
    firebaseConfig: FirebaseConfig;
}