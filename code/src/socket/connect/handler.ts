import { APIGatewayProxyWebsocketEventV2, Context } from "aws-lambda";
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";

export const handler = async (event:APIGatewayProxyWebsocketEventV2, context:Context) => {
    console.log("Node path:", process.env.NODE_PATH);
    console.log("Client connected to websocket:")
    console.log(JSON.stringify({event, context}));    
    
    
    const domain = event.requestContext.domainName;
    const stage = event.requestContext.stage;
    const connectionId = event.requestContext.connectionId;
    const callbackUrl = `https://${domain}/${stage}`;
    const client = new ApiGatewayManagementApiClient({ endpoint: callbackUrl });

    const requestParams = {
        ConnectionId: connectionId,
        Data: JSON.stringify({
            availableRooms: ['fake-room-1', 'fake-room-2']
        })
    };

    const command = new PostToConnectionCommand(requestParams);

    try {
        await client.send(command);
    } catch (error) {
        console.error("Error sending message back to client", error);
    }
};