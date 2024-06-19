import { ConnectedUser } from "../../models/ConnectedUser";
import { FootageReviewChatroom } from "../../models/FootageReviewChatroom";

type DbKey<K extends string | symbol> = {
    [k in K]: string
}

export type DynamoDbKey = DbKey<"pk" | "sk">;

export interface IDynamoDbItem  { 
    [key: string]: any; 
    ttl?: number;
    getKey(): DynamoDbKey;
}

export interface IDynamoDbClient {
    insert(item: IDynamoDbItem): Promise<void>;
    //get<T>(pk: string, sk?: string): Promise<T>;

    getFootageReviewChatrooms(): Promise<FootageReviewChatroom[]>;
    getConnectedUsers(): Promise<ConnectedUser[]>
}