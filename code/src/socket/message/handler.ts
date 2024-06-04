
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";
import { APIGatewayProxyWebsocketEventV2 } from "aws-lambda/trigger/api-gateway-proxy";
import { apiResponse } from "../../common";


export const handler = async (event: APIGatewayProxyWebsocketEventV2, context: any) => {
    console.log("Socket message received:");
    console.log(JSON.stringify({ event, context }));

    const domain = event.requestContext.domainName;
    const stage = event.requestContext.stage;
    const connectionId = event.requestContext.connectionId;
    const callbackUrl = `https://${domain}/${stage}`;
    const client = new ApiGatewayManagementApiClient({ endpoint: callbackUrl });

    const requestParams = {
        ConnectionId: connectionId,
        Data: "Hello!",
    };

    const command = new PostToConnectionCommand(requestParams);

    try {
        await client.send(command);
    } catch (error) {
        console.error(error);
    }

    return apiResponse(true, 200);

};