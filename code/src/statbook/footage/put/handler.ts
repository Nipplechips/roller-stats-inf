import { Handler, S3EventRecord, S3Handler } from "aws-lambda";
import { main } from "./main";
import { AWSStorageClient, apiResponse } from "../../../common";

export const handler: Handler = async (event, context) => {
    console.log("APIG Event Handler:")
    console.log({ event, context });

    const assetBucketName = process.env.asset_bucket_name;
    if(!assetBucketName){
        return apiResponse(undefined, "Asset bucket name unknown", 501);
    }

    const {url, statbookId} = JSON.parse(event.body);
    // validate url
    const footageUrl = new URL(url);
    if(!footageUrl.host.includes("youtube")){
        return apiResponse(undefined, "url host not YouTube", 400);
    }

    console.info("Using footageUrl", footageUrl);

    
    const storageClient = new AWSStorageClient(assetBucketName);
    const result = await main({
        storage: storageClient,
        footageUrl: footageUrl.toString(),
        key: statbookId
    });
    console.debug("Footage link response", JSON.stringify(result));
    return apiResponse(result);

};


