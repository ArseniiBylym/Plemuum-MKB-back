import * as fs from "fs-extra";
import StorageManager from './storage.manager';

export default class FileTransferService {

    private storageManager: StorageManager;

    constructor(storageManager: StorageManager) {
        this.storageManager = storageManager;
    }

    /**
     * Upload a user picture to Firebase
     *
     * @param picture Image file to upload
     * @param {String} userId Image owner's ID
     * @returns {Promise<string>}  Returns a promise with URL pointing to the Firebase location
     */
    public async uploadUserPicture(picture: any, userId: String): Promise<string> {
        const destination = "plenuum/userPictures";
        const fileName = userId.valueOf();

        const url = await this.storageManager.uploadFile(destination, fileName, picture.path)
        fs.unlink(picture.path)
        return url;
    }
}