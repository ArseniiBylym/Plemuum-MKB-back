import * as fs from "fs-extra";
import StorageManager from './storage.manager';
import { ErrorType, PlenuumError } from "../../util/errorhandler";

export default class FileTransferService {
    public static SUPPORTED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];
    public static MAX_FILE_SIZE = 1048576; // 1 MB;
    // https://asecuritysite.com/forensics/magic
    public static MAGIC_NUMBERS: any = {
        'jpg': Buffer.from([parseInt('FF', 16), parseInt('D8', 16)]),
        'jpeg': Buffer.from([parseInt('FF', 16), parseInt('D8', 16)]),
        'gif': Buffer.from([parseInt('47', 16), parseInt('49', 16), parseInt('46', 16), parseInt('38', 16)]),
        'png': Buffer.from([parseInt('89', 16), parseInt('50', 16), parseInt('4E', 16), parseInt('47', 16)])
    };

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
        await this.validateImage(picture);

        const destination = "plenuum/userPictures";
        const fileName = userId.valueOf();

        const url = await this.storageManager.uploadFile(destination, fileName, picture.path);
        fs.unlink(picture.path);
        return url;
    }

    private async validateImage(image: any) {
        if (!(await this.validExtension(image)))
            throw new PlenuumError('Invalid file extension', ErrorType.NOT_ALLOWED);
        if (!this.validFileSize(image)) {
            throw new PlenuumError('File size is too big. Maximum file size is 1 MB', ErrorType.NOT_ALLOWED);
        }
    }

    private validFileSize(file: any) {
        return file.size <= FileTransferService.MAX_FILE_SIZE;
    }

    private async validExtension(file: any) {
        const fileType = file.type.split("/");
        return (fileType[0] === 'image' && FileTransferService.SUPPORTED_IMAGE_EXTENSIONS.indexOf(fileType[1]) !== -1)
            && await this.validContent(file, fileType[1])
    }

    private async validContent(file: any, extension: string) {
        if (!FileTransferService.MAGIC_NUMBERS[extension]) return false; // Unsupported extension

        const buffer = new Buffer(FileTransferService.MAGIC_NUMBERS[extension].byteLength);

        const fd = await fs.open(file.path, 'r');
        await fs.read(fd, buffer, 0, FileTransferService.MAGIC_NUMBERS[extension].byteLength, 0);
        return buffer.compare(FileTransferService.MAGIC_NUMBERS[extension]) === 0;
    }
}