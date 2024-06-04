import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient, PutCommandOutput } from "@aws-sdk/lib-dynamodb";
import { IDynamoDbClient, IDynamoDbItem } from "../services/IDynamoDbClient";

export class DynamoDbKeys {

    static ATTRIBUTE_NAME_TTL = "ttl"
    static KEY_DELIMETER: string = "#"
    static SK_CHATROOM: string = "CHATROOM"

    static PK_FOOTAGE_REVIEW: string = "FOOTAGEREVIEW"

    static getKey(item: any, pkExpression?: (item: any) => Pick<IDynamoDbItem, "pk">, skExpression?: (item: any) => Pick<IDynamoDbItem, "sk">): Pick<IDynamoDbItem, "pk" | "sk"> {
        return {
            pk: pkExpression == null ? item.pk : pkExpression(item),
            sk: skExpression == null ? item.sk : skExpression(item),

        }
    }
    static getKeyString(args: any[]): string {
        return (args ?? []).join(DynamoDbKeys.KEY_DELIMETER);
    }

    static expireRecordAt(record: any, lifetimeInSeconds: number) {
        // Get the current time in epoch second format
        const current_time = Math.floor(new Date().getTime() / 1000);

        // Calculate the expireAt time in epoch second format
        const expire_at = Math.floor((new Date().getTime() + (lifetimeInSeconds * 1000)) / 1000);

        return {
            ...record,
            [DynamoDbKeys.ATTRIBUTE_NAME_TTL]: expire_at
        }
    }


}
export class AWSDynamoDbClient implements IDynamoDbClient {

    private client = new DynamoDBClient({});
    private docClient = DynamoDBDocumentClient.from(this.client);

    constructor(private tableName: string) { }

    insert(item: IDynamoDbItem): Promise<any> {
        const command = new PutCommand({
            TableName: `${this.tableName}`,
            Item: item
        });

        return this.docClient.send(command);

    }
}