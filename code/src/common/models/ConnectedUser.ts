import { DynamoDbKeys } from "../aws/impl/AWSDynamoDbClient";
import { DynamoDbKey, IDynamoDbItem } from "../aws/services/IDynamoDbClient";

export class ConnectedUser implements IDynamoDbItem {
    ttl?: number;

    constructor(public connectionId: string, public name: string){};

    getKey(): DynamoDbKey {
        return {
            pk: `${DynamoDbKeys.PK_CONNECTED_USER}`,
            sk: DynamoDbKeys.getKeyString([this.connectionId])
        }
    }
}