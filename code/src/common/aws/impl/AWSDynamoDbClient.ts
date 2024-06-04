import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient, PutCommandOutput } from "@aws-sdk/lib-dynamodb";
import { IDynamoDbClient, IDynamoDbItem } from "../services/IDynamoDbClient";

export class DynamoDbKeys {
    static KEY_DELIMETER: string = "#"
    static SK_CHATROOM: string = "CHATROOM"

    static getKey(item: any, pkExpression?: (item: any) => Pick<IDynamoDbItem, "pk">, skExpression?: (item: any) => Pick<IDynamoDbItem, "sk">): Pick<IDynamoDbItem, "pk" | "sk"> {
        return {
            pk: pkExpression == null ? item.pk : pkExpression(item),
            sk: skExpression == null ? item.sk : skExpression(item),

        }
    }
    static getKeyString(args: any[]): string {
        return (args ?? []).join(DynamoDbKeys.KEY_DELIMETER);
    }

}
export class AWSDynamoDbClient implements IDynamoDbClient {

    private client = new DynamoDBClient({});
    private docClient = DynamoDBDocumentClient.from(this.client);

    constructor(private tableName: string) { }

    insert(item: IDynamoDbItem): Promise<any> {
        const command = new PutCommand({
            TableName: `${this.tableName}`,
            Item: DynamoDbKeys.getKey(item, (item) => item.prop)
        });

        return this.docClient.send(command);

    }
}