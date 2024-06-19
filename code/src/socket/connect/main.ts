import { IDynamoDbClient} from "../../common";
import { DynamoDbKeys } from "../../common/aws/impl/AWSDynamoDbClient";

export async function main(databaseService: IDynamoDbClient, connectionId: string, name: string): Promise<any> {
    console.log(`Connecting user: '${name}'`, {
        connectionId
    });

    let record = DynamoDbKeys.expireRecordAt({
        pk: DynamoDbKeys.PK_CONNECTED_USER,
        sk: connectionId,
        name
    }, 60 * 60 * 24);
    return databaseService.insert(record);
}

