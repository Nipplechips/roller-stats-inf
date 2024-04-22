import { IStorageClient } from "../../common/aws/services/IStorageClient";
export async function main({ storage, statbookStorageKey, jamIndexes, jamMoments }: { statbookStorageKey: string, jamIndexes: any[], jamMoments: any[], storage: IStorageClient }): Promise<any[]> {

    var statbookObject = await storage.getObject(statbookStorageKey);
    var statbook = JSON.parse(statbookObject ?? "{}");

    statbook.jamIndexes = [...jamIndexes];
    statbook.jamMoments = [...jamMoments];

    console.info("Saving statbook", statbook);
    return storage.writeFileData(statbookStorageKey, JSON.stringify(statbook), {ContentType: "application/json"});
}

