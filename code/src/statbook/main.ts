import { WFTDAStatbookConverter } from "../WFTDAStatbookConverter";
import { IStorageClient } from "../common";
type DerbyJson = any;
export async function main({ converter, storage, workbookData }: { workbookData: Uint8Array, storage: IStorageClient, converter: WFTDAStatbookConverter; }): Promise<DerbyJson> {

    // Convert statbook xlsx to DerbyJson 
    let jsonStatbook: { date: string, teams: { home: { league: string, name: string }, away: { league: string, name: string } } };
    jsonStatbook = converter.convertToJson(workbookData);
    

    // Format date from statbook for filename
    const statbookDate: Date = new Date(jsonStatbook.date);
    const statbookDateFormatted = `${statbookDate.getUTCFullYear()}-${(statbookDate.getUTCMonth() + 1).toString().padStart(2, "0")}-${statbookDate.getUTCDate().toString().padStart(2, "0")}`

    // Compose & sanitise json filename
    const statbookFileName = `${statbookDateFormatted}_${jsonStatbook.teams.home.league}_${jsonStatbook.teams.home.name}_Vs_${jsonStatbook.teams.away.league}_${jsonStatbook.teams.away.name}.json`.replace(/ /g, "-")

    // Save to storage
    const storageResult = await storage.writeFileData(statbookFileName.toLowerCase(), JSON.stringify(jsonStatbook), { ContentType: "application/json" });
    console.info(`Statbook converted`, storageResult);

    return jsonStatbook;
}

