import { IStorageClient } from "../../../common/aws/services/IStorageClient";
import ytdl from 'ytdl-core'

export async function main({ storage, key, footageUrl }: { storage: IStorageClient, key: string; footageUrl: string }): Promise<any[]> {


    // Download video
    const footageStream = ytdl(footageUrl);


    // Save video to storage
    const videoKey = key.replace(".json", ".mp4");
    await storage.uploadFileData(videoKey, footageStream);

    return storage.getObject(key).then(async (objectStr: string | undefined) => {
        let object: any = JSON.parse(objectStr ?? "{}");
        object.footageUrl = await storage.getPresignedUrl("download", {Key: videoKey});
        return storage.writeFileData(key, JSON.stringify(object))
    });
}

