import * as fs from "fs-extra";
import config from "../../config/config";

export default class FileTransferService {

    private gcs: any; // Google Cloud Storage

    constructor() {
        this.gcs = require('@google-cloud/storage')({
            projectId: config.firebaseConfig.projectId,
            keyFilename: `res/${config.firebaseConfig.keyFileName}`
        });
    }

    /**
     * Upload a user picture to Firebase
     *
     * @param picture Image file to upload
     * @param {String} userId Image owner's ID
     * @returns {Promise<string>}  Returns a promise with URL pointing to the Firebase location
     */
    public sendFile(picture: any, userId: String): Promise<string> {
        const bucket = this.gcs.bucket(config.firebaseConfig.bucketName);
        const bucketOptions = {
            destination: `plenuum/userPictures/${userId.valueOf()}`,
            public: true
        };
        let uploadedFile: any;
        return bucket.upload(picture.path, bucketOptions)
            .then((file: any[]) => {
                    uploadedFile = file[0];
                    return fs.unlink(picture.path);
                }
            )
            .then(() => config.firebaseConfig.baseUrl.concat(uploadedFile.name))
    }
}