import { IStorageClient } from "../../../common/aws/services/IStorageClient";
import ytdl from 'ytdl-core'

export async function main({ storage, key, footageUrl }: { storage: IStorageClient, key: string; footageUrl: string }): Promise<any[]> {


    // Download video
    const footageStream = ytdl(footageUrl);

    // Save video to storage
    const videoKey = key.replace(".json", ".mp4");
    await storage.uploadFileData(videoKey, footageStream);

    // Update associated statbook with name of s3 asset that represents footage for statbook
    return storage.getObject(key).then((objectStr: string | undefined) => {
        let object: any = JSON.parse(objectStr ?? "{}");
        object.footageKey = videoKey;
        return storage.writeFileData(key, JSON.stringify(object))
    });
}

