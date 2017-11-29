import config from "../../../config/config";
import StorageManager from './storage.manager';

export default class FirebaseStorageManager implements StorageManager {

    private gcs: any; // Google Cloud Storage

    constructor() {
        this.gcs = require('@google-cloud/storage')({
            projectId: config.firebaseConfig.projectId,
            keyFilename: `config/firebase/${config.firebaseConfig.keyFileName}`
        });
    }

    async uploadFile(destination: string, fileName: string, filePath: string): Promise<string> {
        const bucket = this.gcs.bucket(config.firebaseConfig.bucketName);
        const bucketOptions = {
            destination: `${destination}/${fileName}`,
            public: true
        };
        const file: any[] = await bucket.upload(filePath, bucketOptions);
        return config.firebaseConfig.baseUrl.concat(file[0].name)
    }
}