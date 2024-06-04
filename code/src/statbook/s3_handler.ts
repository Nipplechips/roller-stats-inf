import { S3EventRecord, S3Handler } from "aws-lambda";
import { AWSStorageClient } from "../common";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { main } from "./main";
import { WFTDAStatbookConverter } from "../WFTDAStatbookConverter";




export const s3Handler: S3Handler = async (event, context) => {
    console.log("S3 Event Handler:")
    console.log({ event, context });

    const assumedBucketName = event.Records.find(() => true)?.s3.bucket.name ?? "";
    if(assumedBucketName == "" || assumedBucketName == null || assumedBucketName == undefined){
        throw Error("Cannot assume bucket name from records");
    }

    const statbookConverter = new WFTDAStatbookConverter();
    const storageClient = new AWSStorageClient(assumedBucketName);

    // Get byte array from each event record
    console.debug(`Reading ${event.Records.length} records`)
    const statbookDatas = await processRecords(event.Records);

    // Convert byte data into json and save it into storage
    const conversionRequests = [];
    console.debug(`Converting ${statbookDatas.length} datas into DerbyJson`);
    for (let i = 0; i < statbookDatas.length; i++) {
        const statbookData = statbookDatas[i];

        if (statbookData != null) {
            console.info(`\tConverting statbook ${i} into json format`, statbookData);
            conversionRequests.push(main({
                converter: statbookConverter,
                storage: storageClient,
                workbookData: statbookData
            }));
        }
    }

    
    await Promise.all(conversionRequests).then((r) => console.debug("conversion completed", JSON.stringify(r)));
};


async function processRecords(records: S3EventRecord[]) {

    const s3: S3Client = new S3Client();
    const conversionRequests = [];

    for (let i = 0; i < records.length; i++) {
        const statbookRecord = records[i];

        console.log(`Processing record [${i} - ${statbookRecord.s3.object.key}]:`, statbookRecord);

        const getObjectCommand: GetObjectCommand = new GetObjectCommand({
            Bucket: statbookRecord.s3.bucket.name,
            Key: statbookRecord.s3.object.key
        });

        conversionRequests.push(s3.send(getObjectCommand));
    }

    console.info(`Converting ${conversionRequests.length} objects`)
    const statbookData = await Promise.all(conversionRequests).then((s3Objects) => s3Objects.map((obj) => obj.Body?.transformToByteArray()));

    console.info(`Transforming ${statbookData.length} statbook objects into data array for conversion`);
    return await Promise.all(statbookData);
}
