import { describe, test, beforeAll, afterAll, jest, beforeEach } from "@jest/globals"
import { DynamoDbKeys, propertyOf } from "../../common/aws/impl/AWSDynamoDbClient"
import { IDynamoDbClient, IStorageClient } from "../../common";
import { initFootageReview } from "./main";
import { DynamoDbKey } from "../../common/aws/services/IDynamoDbClient";


describe('Socket Handler: SendMessage', () => {

    beforeAll(async () => {

    })
    afterAll(async () => {
      
    })

    beforeEach(async () => jest.clearAllMocks());


    test(`socket/sendmessage inserts a ${DynamoDbKeys.PK_FOOTAGE_REVIEW} record`, async () => {
        const dbService: IDynamoDbClient = {
            getConnectedUsers: jest.fn(() => Promise.resolve([])),
            getFootageReviewChatrooms: jest.fn(() => Promise.resolve([])),
            insert: jest.fn(() => Promise.resolve())
        }
        const storageService: IStorageClient = {
            checkObjectExists: jest.fn(() => Promise.resolve(true)),
            getFileData: jest.fn(() => Promise.resolve("")),
            getObject: jest.fn(() => Promise.resolve("")),
            getObjects: jest.fn(() => Promise.resolve([])),
            getPresignedUrl: jest.fn(() => Promise.resolve("")),
            listKeys: jest.fn(() => Promise.resolve([])),
            uploadFileData: jest.fn(() => Promise.resolve("")),
            writeFileData: jest.fn(() => Promise.resolve(""))
        }

        const reviewItemStorageKey: string = "footage-review-1";
        await initFootageReview(dbService, storageService, reviewItemStorageKey, "Test Footage Review");

        expect(dbService.insert).toHaveBeenCalledTimes(1);
        expect(storageService.checkObjectExists).toHaveBeenCalledTimes(1);

        expect(storageService.checkObjectExists).toHaveBeenCalledWith(reviewItemStorageKey);
        expect(dbService.insert).toHaveBeenCalledWith(expect.objectContaining({
            [propertyOf<DynamoDbKey>("pk")]: DynamoDbKeys.PK_FOOTAGE_REVIEW
        }));
    });
})