import * as fs from "fs-extra";
import * as sinon from 'sinon';
import FileTransferService from "../../service/file/filetransfer.service";
import { expect } from 'chai';

suite("Filetransfer tests", () => {

    test("uploadUserPicture", async () => {
        const url = "plennum.com/plenuum/userPictures/userId";
        const picture = {
            path: "path"
        };

        const storageManager = {
            uploadFile: sinon.stub()
        }

        storageManager.uploadFile.withArgs("plenuum/userPictures", "userId".valueOf(), picture.path).resolves(url);
        const unlink = sinon.stub(fs, "unlink");

        const fileTransferService = new FileTransferService(storageManager);
        const result = await fileTransferService.uploadUserPicture(picture, "userId")
        unlink.restore();

        expect(result).to.be.equal(url);
        sinon.assert.called(unlink);
    });

});