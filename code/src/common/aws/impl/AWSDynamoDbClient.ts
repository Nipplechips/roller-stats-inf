import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDbKey, IDynamoDbClient, IDynamoDbItem } from "../services/IDynamoDbClient";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { FootageReviewChatroom } from "../../models/FootageReviewChatroom";
import { ConnectedUser } from "../../models/ConnectedUser";

export function propertyOf<TObj>(name: keyof TObj) {
    return name;
}
export class DynamoDbKeys {

    static ATTRIBUTE_NAME_PK = propertyOf<DynamoDbKey>("pk");
    static ATTRIBUTE_NAME_SK = propertyOf<DynamoDbKey>("sk");

    static ATTRIBUTE_NAME_TTL = propertyOf<IDynamoDbItem>("ttl");
    static KEY_DELIMETER: string = "#"
    static SK_CHATROOM: string = "CHATROOM"
    

    static PK_FOOTAGE_REVIEW: string = "FOOTAGEREVIEW"
    static PK_CONNECTED_USER: string = "CONNECTEDUSER"

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

    async getConnectedUsers(): Promise<ConnectedUser[]> {

        const commandInput = {
            TableName: `${this.tableName}`,
            ExpressionAttributeValues: {
                ":pk": `${DynamoDbKeys.PK_CONNECTED_USER}`
            },
            ExpressionAttributeNames: {
                "#pk": "pk"
            },
            KeyConditionExpression: "#pk = :pk"
        };

        const items: ConnectedUser[] = [];
        let result = await this.docClient.send(new QueryCommand(commandInput));
        if (!result.Items) {
            return [];
        }

        for (let i = 0; i < (result.Items ?? []).length; i++) {
            items.push(this.getItem(result.Items![i]));
        }

        while (result.LastEvaluatedKey) {
            result = await this.docClient.send(new QueryCommand({
                ...commandInput,
                ExclusiveStartKey: result.LastEvaluatedKey
            }));

            for (let i = 0; i < (result.Items ?? []).length; i++) {
                items.push(this.getItem(result.Items![i]));
            }
        }

        return items;
    }

    async getFootageReviewChatrooms(): Promise<FootageReviewChatroom[]> {

        const commandInput = {
            TableName: `${this.tableName}`,
            ExpressionAttributeValues: {
                ":pk": `${DynamoDbKeys.PK_FOOTAGE_REVIEW}`
            },
            ExpressionAttributeNames: {
                "#pk": "pk"
            },
            KeyConditionExpression: "#pk = :pk"
        };

        const items: FootageReviewChatroom[] = [];
        let result = await this.docClient.send(new QueryCommand(commandInput));
        if (!result.Items) {
            return [];
        }

        for (let i = 0; i < (result.Items ?? []).length; i++) {
            items.push(this.getItem<FootageReviewChatroom>(result.Items![i]));
        }

        while (result.LastEvaluatedKey) {
            result = await this.docClient.send(new QueryCommand({
                ...commandInput,
                ExclusiveStartKey: result.LastEvaluatedKey
            }));

            for (let i = 0; i < (result.Items ?? []).length; i++) {
                items.push(this.getItem<FootageReviewChatroom>(result.Items![i]));
            }
        }

        return items;
    }

    private getItem<T = any>(dbRecord: Record<string, any>): T {
        console.debug("Unmarshalling record", JSON.stringify(dbRecord));
        try{
            return unmarshall(dbRecord) as T;
        }catch(error){
            console.warn(`Error unmarhsalling type.  Return record as-is`, error)
        }

        return dbRecord as T;
    }
}

