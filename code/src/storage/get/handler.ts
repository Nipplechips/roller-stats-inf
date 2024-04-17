import { Handler } from "aws-lambda";
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
    const assetKey = event.queryStringParameters.assetKey;
    if(!assetKey){
        return apiResponse(undefined, "No asset key found in query parameters", 400);
    }
    
    const result = await main({
        storage: storageClient,
        key: assetKey
    });
    console.debug("Get storage url response", JSON.stringify(result));
    return apiResponse(result);

};


