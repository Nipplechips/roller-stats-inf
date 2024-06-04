import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { AWSDynamoDbClient, apiResponse } from "../../common";
import { main } from "./main";

export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
    console.log("Event recieved", {event, context});

    try {

        const {roomId, creatorId, title} = JSON.parse(event.body ?? "{}");
        const res = await main({
            dbClient: new AWSDynamoDbClient(`${process.env.tableName}`), 
            roomId,
            creatorId,
            title
        });

        return apiResponse(res, 200);
    } catch (error) {
        console.error("Error creating footage review", error);
        return apiResponse(error, 500);
    }
}