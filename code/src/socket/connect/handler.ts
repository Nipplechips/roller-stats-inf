import { APIGatewayProxyWebsocketEventV2, Context } from "aws-lambda";
import { apiResponse } from "../../common";


export const handler = async (event:APIGatewayProxyWebsocketEventV2, context:Context) => {
    console.log("Client connected to websocket:")
    console.log(JSON.stringify({event, context}));    

    return apiResponse(true, 200);
    
};