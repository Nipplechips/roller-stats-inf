import { IStorageClient } from "../../common/aws/services/IStorageClient";

export async function main({ storage, key }: { key: string, storage: IStorageClient }): Promise<string> {
    console.info(`Retrieving presigned url to download asset: ${key}`);
    return storage.getPresignedUrl("download", {Key: key});
}

