import { APIGatewayProxyWebsocketEventV2, Context } from "aws-lambda";
import { AWSDynamoDbClient, IDynamoDbClient, apiResponse } from "../../common";
import { main } from "./main";


export const handler = async (event:APIGatewayProxyWebsocketEventV2, context:Context) => {
    console.log("Client connected to websocket:")
    console.log(JSON.stringify({event, context}));    

    const databaseService: IDynamoDbClient = new AWSDynamoDbClient(process.env.table_name ?? "");

    await main(databaseService, event.requestContext.connectionId, "unknown-user");
    return apiResponse(true, 200);
    
};