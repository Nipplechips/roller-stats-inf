import { ApiGatewayManagementApiClient, PostToConnectionCommand, PostToConnectionCommandOutput } from "@aws-sdk/client-apigatewaymanagementapi";
import { IDynamoDbClient, IStorageClient } from "../../common";
import { DynamoDbKeys } from "../../common/aws/impl/AWSDynamoDbClient";

async function initFootageReview(databaseService: IDynamoDbClient, storageService: IStorageClient, reviewItemStorageKey: string, reviewHost: string): Promise<any> {
    console.log("Initialising footage review", {
        reviewItemStorageKey
    });

    // Check that key exists in s3 as a footage review item
    const res: boolean = await storageService.checkObjectExists(reviewItemStorageKey);

    // Create chatroom record in database
    let record = DynamoDbKeys.expireRecordAt({
        pk: DynamoDbKeys.PK_FOOTAGE_REVIEW,
        sk: DynamoDbKeys.getKeyString([
            DynamoDbKeys.SK_CHATROOM,
            reviewItemStorageKey
        ]),
        connectionHost: reviewHost
    }, 60 * 60 * 24);
    await databaseService.insert(record);

    // return footage review key in response
    return reviewItemStorageKey;

}

async function respondToClients(data: any, responseContext: { domainName: string, stage: string, connectionId: string }): Promise<PostToConnectionCommandOutput> {

    const callbackUrl = `https://${responseContext.domainName}/${responseContext.stage}`;
    const client = new ApiGatewayManagementApiClient({ endpoint: callbackUrl });

    const requestParams = {
        ConnectionId: responseContext.connectionId,
        Data: JSON.stringify(data),
    };

    const command = new PostToConnectionCommand(requestParams);

    return client.send(command);
}

export { initFootageReview, respondToClients }

