import { AWSDynamoDbClient, AWSStorageClient, IDynamoDbClient, IStorageClient, apiResponse } from "../../common";
import { initFootageReview, respondToClients } from "./main";


export const handler = async (event: any, context: any) => {
    console.log("Socket message received:");
    console.log(JSON.stringify({ event, context }));

    try {
        console.log("Bucket name:", `${process.env.asset_bucket_name}`);
        if (undefined == `${process.env.asset_bucket_name}`) {
            throw Error("asset_bucket_name not present in configuration")
        }
        
        console.log("Table name:", `${process.env.table_name}`);
        if (undefined == `${process.env.table_name}`) {
            throw Error("table_name not present in configuration")
        }

        const message = JSON.parse(event.body ?? "{}");
        const messageAction: string = message.data.action ?? "no-action";
        const messageData = message.data;


        const storageService: IStorageClient = new AWSStorageClient(process.env.asset_bucket_name ?? "");
        const databaseService: IDynamoDbClient = new AWSDynamoDbClient(process.env.table_name ?? "");

        let res = undefined;
        switch (`${messageAction}`.toLowerCase()) {
            case "init-footage-review":
                const { key } = messageData;
                if (!key || "" == key) {
                    throw Error("Footage review requests must provide a key in data payload");
                }
                res = await initFootageReview(databaseService, storageService, key, event.requestContext.connectionId);
                break;

            default:
                console.warn(`No action handler for message: ${messageAction}`)
                res = "no action taken"
                break;
        }

        try {
            await respondToClients(res, {
                connectionId: event.requestContext.connectionId,
                domainName: event.requestContext.domainName,
                stage: event.requestContext.stage
            });

        } catch (error) {
            console.error("Error sending message to socket client", error);
        }

    } catch (error) {
        console.error(`Error in messaging action`, error);
        await respondToClients(error, {
            connectionId: event.requestContext.connectionId,
            domainName: event.requestContext.domainName,
            stage: event.requestContext.stage
        });

        return apiResponse(error, 500);
    }



    return apiResponse(true, 200);

};