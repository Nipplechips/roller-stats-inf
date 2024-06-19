
import { DynamoDbKeys } from "../aws/impl/AWSDynamoDbClient";
import { DynamoDbKey, IDynamoDbItem } from "../aws/services/IDynamoDbClient";

export class FootageReviewChatroom implements IDynamoDbItem {
    constructor(public hostId: string, public hostConnectionId: string, public title: string, public ttl?: number){}
    getKey(): DynamoDbKey {
        return {
            pk: DynamoDbKeys.PK_FOOTAGE_REVIEW,
            sk: DynamoDbKeys.getKeyString([
                DynamoDbKeys.SK_CHATROOM,
                this.hostConnectionId
            ])
        }
    }
}