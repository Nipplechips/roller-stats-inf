import { GetObjectCommand, PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { IStorageClient } from "./common/aws/services/IStorageClient";


class AWSStorageClient implements IStorageClient {

    private s3: S3Client = new S3Client();
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
        const res = await this.s3.send(getObjectCommand);
        return JSON.parse(data, reviver);
    }

    async writeFileData(fileName: string, fileData: string, extras?:Partial<PutObjectCommandInput>) {

        const putObjectCommand: PutObjectCommand = new PutObjectCommand({
            Key: `${fileName}`,
            Bucket: this.bucketName,
            Body: fileData,
            ...extras
        });
        return this.s3.send(putObjectCommand);
    }

    async getPresignedUrl(commandName: string, params: {Key: string}): Promise<string>{
        throw "Not implemented";
    }

    async listKeys(pathPrefix?: string): Promise<string[]>{
        throw "Not implemented"
    }

}

export { AWSStorageClient }
