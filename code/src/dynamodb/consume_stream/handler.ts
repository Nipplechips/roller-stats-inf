import { Context } from "aws-lambda";
import { AWSDynamoDbClient, apiResponse } from "../../common";
import { main } from "./main";

export const handler = async (event:any, context: Context) => {
    console.log("Event recieved", {event, context});
}