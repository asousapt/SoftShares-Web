const minio = require('minio');
import * as Fs from 'fs'
require('dotenv').config();

var minioClient = new minio.Client({
    endPoint: process.env[`MINIO_ENDPOINT`],
    port: process.env[`MINIO_PORT`],
    useSSL: true,
    accessKey: process.env[`MINIO_ACCESSKEY`],
    secretKey: process.env[`MINIO_SECRETKEY`],
})

const objectStorage = {
    insertFile: async function(bucketName, file, fileName){
        const exists = await minioClient.bucketExists(bucketName);
        if (!exists) {
            minioClient.makeBucket(bucketName, { ObjectLocking: true }, function (err) {
                if (err) return console.log('Error creating bucket with object lock.', err)
                console.log('Bucket created successfully and enabled object lock')
            });
        }
        const fileStream = Fs.createReadStream(file);
        const fileStat = Fs.stat(file, function (err, stats) {
            if (err) {
                return console.log(err);
            }
            minioClient.putObject(bucketName, fileName, fileStream, stats.size, function (err, objInfo) {
                if (err) {
                    return console.log(err);
                }
                console.log('Success', objInfo);
            });
        });
    },

    deleteFiles: async function(bucketName, fileNames){
        minioClient.removeObjects(bucketName, fileNames, function (e) {
            if (e) {
                return console.log('Unable to remove Objects ', e);
            }
            console.log('Removed the objects successfully');
        });
    },

    deleteBucket: async function(bucketName){
        try {
            await minioClient.removeBucket(bucketName);
            console.log('Bucket removed successfully.');
        } catch (err) {
            console.log('unable to remove bucket.');
        }
    },

    getFilesByBucket: async function(bucketName){
        const data = [];
        const stream = minioClient.listObjects(bucketName, '', true, { IncludeVersion: true });
        stream.on('data', function (obj) {
            data.push(obj);
        })
        return data;
    },

    getAllUrlByBucket: async function(bucketName){
        const files = this.getFilesByBucket(bucketName);

        const urls = [];
        for (const file of files){
            minioClient.presignedGetObject(bucketName, file.name, 24 * 60 * 60, function (err, presignedUrl) {
                if (err) return console.log(err);
                urls.push(presignedUrl);
            });
        }
        return urls;
    }
}

module.exports = objectStorage;