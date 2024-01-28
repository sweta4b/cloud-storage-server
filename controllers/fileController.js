const mongoose = require('mongoose');
const { Readable } = require('stream');
const { MetaData } = require('../model/folderModel');

async function uploadFile(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const { originalname, mimetype, buffer, size } = req.file;
        const userId = req.user.userId;

        const newFile = new MetaData({
            name: originalname,
            userId: userId,
            isDirectory: false,
            size: size,
            contentType: mimetype,
            length: buffer.length,
        });

        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: "cloud-storage"
        });
        const uploadStream = bucket.openUploadStream(originalname);
        const readBuffer = new Readable();
        readBuffer.push(buffer);
        readBuffer.push(null);

        const isUploaded = await new Promise((resolve, reject) => {
            readBuffer.pipe(uploadStream)
                .on("finish", resolve)
                .on("error", reject);
        });

        newFile.fileId = new mongoose.mongo.ObjectId(uploadStream.id);
        const savedFile = await newFile.save();

        if (!savedFile) {
            return res.status(404).send("Error occurred while saving the file");
        }

        return res.send({ file: savedFile, message: "File uploaded successfully" });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function downloadFile(req, res) {
    try {
        const userId = req.user.userId;
        const role = req.user.role;
        const { fileId } = req.params;

        let file;

        if (role === 'admin') {
            file = await MetaData.findOne({ _id: fileId });
        } else {
            file = await MetaData.findOne({ userId, _id: fileId });
        }

        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: "cloud-storage"
        });
        const downloadStream = bucket.openDownloadStream(file.fileId);

        downloadStream.on("file", (file) => {
            res.set("Content-Type", file.contentType);
        });

        downloadStream.pipe(res);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getUserFiles(req, res) {
    try {
        const userId = req.user.userId;
        const role = req.user.role;

        let files;
        if (role === "admin") {
            files = await MetaData.find({});
        } else {
            files = await MetaData.find({ userId });
        }
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteFile(req, res) {
    try {
        const userId = req.user.userId;
        const fileId = req.params.fileId;
        const role = req.user.role;

        let file;

        if (role === "admin") {
            file = await MetaData.findOne({ _id: fileId });
        } else {
            file = await MetaData.findOne({ userId, _id: fileId });
        }

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: "cloud-storage"
        });
        await bucket.delete(file.fileId);

        await MetaData.findOneAndDelete({ _id: fileId });

        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { uploadFile, downloadFile, deleteFile, getUserFiles };
