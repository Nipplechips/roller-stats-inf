import { Handler, S3EventRecord, S3Handler } from "aws-lambda";
import { main } from "./main";
import { AWSStorageClient, apiResponse } from "../../common";


export const handler: Handler = async (event, context) => {
    console.log("APIG Event Handler:")
    console.log({ event, context });

    const assetBucketName = process.env.asset_bucket_name;
    if(!assetBucketName){
        return apiResponse(undefined, "Asset bucket name unknown", 501);
    }

    const storageClient = new AWSStorageClient(assetBucketName);
    
    const result = await main({
        storage: storageClient
    });
    console.debug("Statbooks response", JSON.stringify(result));
    return apiResponse(result);

};


