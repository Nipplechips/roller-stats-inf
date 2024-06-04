export type IDynamoDbItem = {pk: string, sk: string, [key: string]: any};
export interface IDynamoDbClient {
    insert(item: IDynamoDbItem): Promise<void>;
}