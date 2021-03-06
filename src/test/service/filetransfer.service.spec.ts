import * as fs from "fs-extra";
import * as sinon from 'sinon';
import { expect } from 'chai';
import FileManager from "../../manager/file/file.manager";

suite("Filetransfer tests", () => {

    test("uploadUserPicture", async () => {
        const url = "plennum.com/plenuum/userPictures/userId";
        const picture = {
            path: "path",
            type: "image/jpeg",
            size: 1000000
        };

        const storageManager = {
            uploadFile: sinon.stub()
        };

        storageManager.uploadFile.withArgs("plenuum/userPictures", "userId".valueOf(), picture.path).resolves(url);
        const unlink = sinon.stub(fs, "unlink");
        const open = sinon.stub(fs, "open");
        const incomingBuffer = new Buffer(FileManager.MAGIC_NUMBERS['jpeg']);
        const read = sinon.stub(fs, "read").callsFake((fd, buffer) => incomingBuffer.copy(buffer));

        const fileTransferService = new FileManager(storageManager);
        const result = await fileTransferService.uploadUserPicture(picture, "userId");
        unlink.restore();
        open.restore();
        read.restore();

        expect(result).to.be.equal(url);
        sinon.assert.called(unlink);
    });

});