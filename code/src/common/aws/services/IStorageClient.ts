import { StreamingBlobPayloadInputTypes } from "@smithy/types";

type StorageFileData = StreamingBlobPayloadInputTypes;
interface IStorageClient {
    getFileData(fileName: string, reviver?: (this: any, key: string, value: any) => any): Promise<any>;
    writeFileData(fileName: string, fileData: StorageFileData, extras?: any): Promise<any>;
    uploadFileData(fileName: string, fileData: StorageFileData): Promise<any>;
    getPresignedUrl(commandName: "upload" | "download", params: { Key: string }): Promise<string>;
    listKeys(prefix?: string, suffix?: string, keyList?: string[], pageToken?: string): Promise<string[]>;
    getObject(key: string): Promise<string | undefined>
    getObjects(prefix?: string, suffix?: string): Promise<({key: string, contents: string})[]> ;
    checkObjectExists(key: string): Promise<boolean>;
}

export { IStorageClient, StorageFileData }