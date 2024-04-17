import { IStorageClient } from "../../common/aws/services/IStorageClient";

export async function main({ storage }: { storage: IStorageClient }): Promise<any[]> {

    var modifiedObjects = [];
    var objects = await storage.getObjects(undefined, ".json");

    console.debug(`Parsing ${objects.length} statbooks from storage`, objects);
    for (let i = 0; i < objects.length; i++) {
        let object = objects[i];

        console.debug(`Statbook ${i}`, object.contents);
        const jsonObject = JSON.parse(object.contents);
        jsonObject.storageKey = object.key;
        modifiedObjects.push(jsonObject);
    }
    return modifiedObjects;
}

