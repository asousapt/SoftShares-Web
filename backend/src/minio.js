const minio = require('minio');
const fs = require('fs');
const stream = require('stream');
require('dotenv').config();

var minioClient = new minio.Client({
    endPoint: process.env[`MINIO_ENDPOINT`],
    port: parseInt(process.env[`MINIO_PORT`]),
    useSSL: true,
    accessKey: process.env[`MINIO_ACCESSKEY`],
    secretKey: process.env[`MINIO_SECRETKEY`],
})

const objectStorage = {
    insertFile: async function(bucketName, file, fileName){
        const exists = await minioClient.bucketExists(bucketName.toLowerCase());

        if (!exists) {
            minioClient.makeBucket(bucketName.toLowerCase(), { ObjectLocking: true }, function (err) {
                if (err) return console.log('Error creating bucket with object lock.', err)
                console.log('Bucket created successfully and enabled object lock')
            });
        }

        const buffer = Buffer.from(file, 'base64');
            
        const readStream = new stream.PassThrough();
        readStream.end(buffer);

        minioClient.putObject(bucketName.toLowerCase(), fileName, readStream, buffer.length, (err, objInfo) => {
            if (err) {
                return console.log('Error uploading object', err);
            }
            console.log('Success', objInfo);
        });
    },

    deleteFiles: async function(bucketName, fileNames){
        minioClient.removeObjects(bucketName.toLowerCase(), fileNames, function (e) {
            if (e) {
                return console.log('Unable to remove Objects ', e);
            }
            console.log('Removed the objects successfully');
        });
    },

    deleteBucket: async function(bucketName){
        try {
            await minioClient.removeBucket(bucketName.toLowerCase());
            console.log('Bucket removed successfully.');
        } catch (err) {
            console.log('unable to remove bucket.');
        }
    },

    getFilesByBucket: async function(bucketName){
        const data = [];
        const stream = minioClient.listObjects(bucketName.toLowerCase(), '', true, { IncludeVersion: true });
        stream.on('data', function (obj) {
            data.push(obj);
        })
        return data;
    },

    getAllUrlByBucket: async function(bucketName){
        const files = this.getFilesByBucket(bucketName.toLowerCase());

        const urls = [];
        for (const file of files){
            minioClient.presignedGetObject(bucketName.toLowerCase(), file.name, 24 * 60 * 60, function (err, presignedUrl) {
                if (err) return console.log(err);
                urls.push(presignedUrl);
            });
        }
        return urls;
    }
}

module.exports = objectStorage;