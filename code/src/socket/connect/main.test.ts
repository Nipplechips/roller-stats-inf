import { describe, test, beforeAll, afterAll, jest, beforeEach } from "@jest/globals"
import { AWSDynamoDbClient, DynamoDbKeys, propertyOf } from "../../common/aws/impl/AWSDynamoDbClient"
import { createMock } from 'ts-auto-mock';
import { IDynamoDbClient } from "../../common";
import { main } from "./main";
import { DynamoDbKey } from "../../common/aws/services/IDynamoDbClient";


describe('Socket Handler: Connect', () => {

    beforeAll(async () => {

    })
    afterAll(async () => {
      
    })

    beforeEach(async () => jest.clearAllMocks());


    test(`socket/connect inserts a ${DynamoDbKeys.PK_CONNECTED_USER} record`, async () => {
        const dbService: IDynamoDbClient = {
            getConnectedUsers: jest.fn(() => Promise.resolve([])),
            getFootageReviewChatrooms: jest.fn(() => Promise.resolve([])),
            insert: jest.fn(() => Promise.resolve())
        }
        await main(dbService, "connection-id-1", "Test Connected User");

        expect(dbService.insert).toHaveBeenCalledTimes(1);
        expect(dbService.insert).toHaveBeenCalledWith(expect.objectContaining({
            [propertyOf<DynamoDbKey>("pk")]: DynamoDbKeys.PK_CONNECTED_USER
        }));
    });
})