
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";
import { apiResponse } from "../../common";

export const handler = async (event: any, context: any) => {
    console.log("Socket message received:");
    console.log(JSON.stringify({ event, context }));
};