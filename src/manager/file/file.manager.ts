import * as fs from "fs-extra";
import StorageManager from './storage.manager';
import { ErrorType, PlenuumError } from "../../util/errorhandler";
import  * as sharp  from "sharp";

export default class FileManager {
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
        const thumbFileName = `thumb-${fileName}`;

        const url = await this.storageManager.uploadFile(destination, fileName, picture.path);

        //create thumbnail
        await sharp(picture.path)
            .resize(300)
            .toBuffer()
            .then( data => {
                fs.writeFile(picture.path , data, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("The thumbnail file was saved!");
                });
            })
            .catch( err => console.log(err) );
        await this.storageManager.uploadFile(destination, thumbFileName, picture.path);

        fs.unlink(picture.path);
        return url;
    }

    public async convertCSV2UserArray(csvFile: any): Promise<any[]> {
        const fileType = csvFile.type.split("/");
        if (!(fileType[1] === 'csv' || csvFile.name.split('.').pop() === 'csv')) throw new PlenuumError(csvFile.type, ErrorType.NOT_ALLOWED);
        const csvString = await fs.readFile(csvFile.path, 'utf-8');
        return this.csv2JSON(csvString);
    }

    private csv2JSON(csv: string) {
        const lines = csv.split(/\r\n|\n/);
        lines.forEach((l) => l.trim());
        const result = [];
        const headers = lines[0].split(",");
        for (let i = 1; i < lines.length; i++) {
            const obj: any = {};
            const currentline = lines[i].split(",");
            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }
            result.push(obj);
        }
        return result;
    }

    private async validateImage(image: any) {
        if (!(await this.validImageExtension(image)))
            throw new PlenuumError('Invalid file extension', ErrorType.NOT_ALLOWED);
        if (!this.validFileSize(image)) {
            throw new PlenuumError('File size is too big. Maximum file size is 1 MB', ErrorType.NOT_ALLOWED);
        }
    }

    private validFileSize(file: any) {
        return file.size <= FileManager.MAX_FILE_SIZE;
    }

    private async validImageExtension(file: any) {
        const fileType = file.type.split("/");
        return (fileType[0] === 'image' && FileManager.SUPPORTED_IMAGE_EXTENSIONS.indexOf(fileType[1]) !== -1)
            && await this.validContent(file, fileType[1])
    }

    private async validContent(file: any, extension: string) {
        if (!FileManager.MAGIC_NUMBERS[extension]) return false; // Unsupported extension

        const buffer = new Buffer(FileManager.MAGIC_NUMBERS[extension].byteLength);

        const fd = await fs.open(file.path, 'r');
        await fs.read(fd, buffer, 0, FileManager.MAGIC_NUMBERS[extension].byteLength, 0);
        return buffer.compare(FileManager.MAGIC_NUMBERS[extension]) === 0;
    }
}