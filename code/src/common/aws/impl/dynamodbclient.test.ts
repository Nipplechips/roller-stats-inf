import { describe, test, expect, beforeAll, afterAll } from "@jest/globals"
import { IDynamoDbClient } from "../services/IDynamoDbClient"
import { AWSDynamoDbClient, DynamoDbKeys, propertyOf } from "./AWSDynamoDbClient"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DeleteCommand, DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import environment from '../../../testing/dev.environment.json'
import { FootageReviewChatroom } from "../../models/FootageReviewChatroom";
import { ConnectedUser } from "../../models/ConnectedUser";


const dbTeardown = async () => {

    var client = new DynamoDBClient();
    var docClient = DynamoDBDocumentClient.from(client);

    const teardownPartition = async (partitionKey: string) => {
        const input = {
            TableName: `${environment.dbTableName}`,
            ExpressionAttributeNames: {
                "#pk": DynamoDbKeys.ATTRIBUTE_NAME_PK
            },
            ExpressionAttributeValues: {
                ":pk": partitionKey
            },
            KeyConditionExpression: `#pk = :pk`
        };

        console.debug(`Querying for partition: ${partitionKey} items`, JSON.stringify(input));
        let partitionItemsQueryResult = await docClient.send(new QueryCommand(input));
        const items: any[] = [...(partitionItemsQueryResult.Items ?? [])];

        while (partitionItemsQueryResult.LastEvaluatedKey) {
            partitionItemsQueryResult = await docClient.send(new QueryCommand({
                ...input,
                ExclusiveStartKey: partitionItemsQueryResult.LastEvaluatedKey
            }));

            for (let i = 0; i < (partitionItemsQueryResult.Items ?? []).length; i++) {
                items.push(partitionItemsQueryResult.Items![i]);
            }
        }

        console.debug(`Deleting ${items.length} partition items`, items);
        await Promise.all(items.map((item) => docClient.send(new DeleteCommand({
            TableName: `${environment.dbTableName}`,
            Key: DynamoDbKeys.getKey(item)
        }))));
    };

    await Promise.all([
        teardownPartition(DynamoDbKeys.PK_FOOTAGE_REVIEW),
        teardownPartition(DynamoDbKeys.PK_CONNECTED_USER),
    ]);

}
const dbSetup = async () => {

    var client = new DynamoDBClient();
    var docClient = DynamoDBDocumentClient.from(client);

    const makeChatRooms = (count: number): FootageReviewChatroom[] => {
        const items: FootageReviewChatroom[] = [];
        for (let i = 0; i < count; i++) {
            items.push(new FootageReviewChatroom(
                `host-id-${i + 1}`,
                `host-connection-${i + 1}`,
                `Footage Review Chatroom ${i + 1}`
            ));
        }

        return items;
    }

    const makeConnectedUsers = (count: number): ConnectedUser[] => {
        const items: ConnectedUser[] = [];
        for (let i = 0; i < count; i++) {
            items.push(new ConnectedUser(
                `connected-user-id-${i + 1}`,
                `connected-user-${i + 1}`,
            ));
        }

        return items;
    }

    await Promise.all(makeChatRooms(5).map((chatroom) => docClient.send(new PutCommand({
        TableName: `${environment.dbTableName}`,
        Item: {
            ...chatroom.getKey(),
            ...chatroom
        }
    }))));
    await Promise.all(makeConnectedUsers(5).map((user) => docClient.send(new PutCommand({
        TableName: `${environment.dbTableName}`,
        Item: {
            ...user.getKey(),
            ...user
        }
    }))));
}

describe('Dynamodb Client integrates with AWS', () => {

    beforeAll(async () => {
        await dbTeardown();
        await dbSetup();
    })
    afterAll(async () => {
        await dbTeardown();
    })

    test('Can init', () => {

        console.info("Creating db client");
        const service: IDynamoDbClient = new AWSDynamoDbClient(environment.dbTableName);
        expect(service).not.toBeUndefined;
    })

    test('Can get model.FootageReviewChatRoom', async () => {

        const service: IDynamoDbClient = new AWSDynamoDbClient(environment.dbTableName);

        const expected = {
            [propertyOf<FootageReviewChatroom>("hostConnectionId")]: expect.any(String),
            [propertyOf<FootageReviewChatroom>("hostId")]: expect.any(String),
            [propertyOf<FootageReviewChatroom>("title")]: expect.any(String),
        };

        const chatrooms = await service.getFootageReviewChatrooms();

        expect(chatrooms.length).toBeGreaterThan(1);
        expect(chatrooms).toEqual(expect.arrayContaining([expect.objectContaining(expected)]))
    })

    test('Can get model.ConnectedUsers', async () => {

        const service: IDynamoDbClient = new AWSDynamoDbClient(environment.dbTableName);

        const expected = {
            [propertyOf<ConnectedUser>("connectionId")]: expect.any(String)
        };

        const users = await service.getConnectedUsers();

        expect(users.length).toBeGreaterThan(1);
        expect(users).toEqual(expect.arrayContaining([expect.objectContaining(expected)]))
        
    })
})