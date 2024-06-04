import { IDynamoDbClient } from "../../common";
import { DynamoDbKeys } from "../../common/aws/impl/AWSDynamoDbClient";

export function main({ dbClient, roomId, creatorId, title }: { dbClient: IDynamoDbClient; roomId: string; creatorId: string; title: string; }) {
    return dbClient.insert({
        pk: roomId,
        sk: DynamoDbKeys.getKeyString([
            DynamoDbKeys.SK_CHATROOM,
            creatorId
        ]),
        title
    });
}