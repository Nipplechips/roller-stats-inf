import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { IStorageClient, StorageFileData } from "../services/IStorageClient";
import { Upload } from "@aws-sdk/lib-storage";
import {
    getSignedUrl,
    S3RequestPresigner,
} from "@aws-sdk/s3-request-presigner";

class AWSStorageClient implements IStorageClient {

    private s3Client: S3Client = new S3Client();

    private bucketName: string;
    /**
     *
     */
    constructor(bucketName: string) {
        this.bucketName = bucketName;
    }

    async getFileData(fileName: string, reviver?: (this: any, key: string, value: any) => any) {
        console.debug(`Reading file data: ${this.bucketName}/${fileName}`);
        let data: any = null;
        const getObjectCommand: GetObjectCommand = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: fileName,
            ResponseContentType: "application/json"
        });
        const res = await this.s3Client.send(getObjectCommand);
        return JSON.parse(data, reviver);
    }

    async writeFileData(fileName: string, fileData: StorageFileData, extras?: Partial<PutObjectCommandInput>) {
        const putObjectCommand: PutObjectCommand = new PutObjectCommand({
            Key: `${fileName}`,
            Bucket: this.bucketName,
            Body: fileData,
            ...extras
        });
        return this.s3Client.send(putObjectCommand);
    }

    async uploadFileData(fileName: string, fileData: StorageFileData): Promise<any> {
        const parallelUploads3 = new Upload({
            client: this.s3Client,
            queueSize: 4, // optional concurrency configuration
            leavePartsOnError: false, // optional manually handle dropped parts
            params: {
                Bucket: this.bucketName,
                Key: fileName,
                Body: fileData
            },
        });

        parallelUploads3.on("httpUploadProgress", (progress) => {
            console.log(progress);
        });

        return parallelUploads3.done();
    }


    async getPresignedUrl(commandName: "upload" | "download", params: { Key: string }): Promise<string> {
        const { Bucket, Key } = { Bucket: this.bucketName, Key: params.Key };

        //        return getSignedUrl(this.s3Client, commandName == "upload" ? new PutObjectCommand({Bucket, Key}) : new GetObjectCommand({Bucket, Key}));
        return Promise.reject("Not Implemented");
    }

    async listKeys(prefix?: string, suffix?: string, keyList?: string[], pageToken?: string): Promise<string[]> {

        /**
         * Recursive call so on initial call keylist isnt provided.  
         * Create a new keylist to start storing listed keys in
         */

        if (!keyList || keyList.length == 0) {
            keyList = [];
        }

        /**
         * List object command with provided prefix and paging token
         */
        console.debug("Listing stored objects", {
            bucket: this.bucketName,
            prefix: prefix,
            suffix: suffix,
            page: pageToken
        })
        const listCommand: ListObjectsV2Command = new ListObjectsV2Command({
            Bucket: this.bucketName,
            Prefix: prefix,
            ContinuationToken: pageToken
        });

        /**
         * Push results into keylist collection
         */
        const results = await this.s3Client.send(listCommand);
        console.debug(`Listed ${results.KeyCount} stored objects. ${results.IsTruncated ? "There are more objects" : "No more objects"}`);
        keyList.push(...results.Contents?.map((obj) => obj.Key ?? "") ?? []);

        /**
         * If API indicates there are more results, go round again
         * providing the existing keylist as well as paging token.
         * 
         * If API indicates there are no more pagees, then just return
         * the populated keylist
         */
        if (results.NextContinuationToken) {
            console.debug(`\tListing next page of objects...`);
            return this.listKeys(prefix, suffix, keyList, results.NextContinuationToken);
        }
        else {
            console.debug(`\tListing ${keyList.length} objects`, keyList);
            return keyList.filter((key) => suffix == null || key.endsWith(suffix));
        }
    }

    async getObject(key: string): Promise<string | undefined> {
        return this.s3Client.send(new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key
        })).then((output) => output.Body?.transformToString("utf-8"));
    }

    async getObjects(prefix?: string, suffix?: string): Promise<({ key: string, contents: string })[]> {
        /**
         * List all available keys with prefix/suffix
         */
        const keyList = await this.listKeys(prefix, suffix);
        console.debug(`Getting ${keyList.length} objects`, keyList);
        /**
         * Fetch objects from storage and decode to string
         */
        const getRequests = keyList.map(async (key) => {
            const command: GetObjectCommand = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key
            });

            return this.s3Client.send(command).then(async (res) => {
                return { key: key, contents: await res.Body?.transformToString("utf-8") ?? "{}" };
            }, (reason) => { console.error(reason); return { key: "", contents: "{}" } });
        });

        return Promise.all(getRequests);
    }
}

export { AWSStorageClient }
