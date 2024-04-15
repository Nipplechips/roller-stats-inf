import { IStorageClient, WFTDAStatbookConverter } from "../common";

export async function main({ converter, storage, workbookData }: {workbookData: Uint8Array, storage: IStorageClient, converter: WFTDAStatbookConverter; }): Promise<void>{    
    const jsonStatbook: {date: string, teams: {home: {league: string, name: string}, away: {league: string, name: string}}} = converter.convertToJson(workbookData);
    const statbookDate: Date = new Date(jsonStatbook.date);
    const statbookDateFormatted = `${statbookDate.getUTCFullYear()}-${(statbookDate.getUTCMonth()+1).toString().padStart(2, "0")}-${statbookDate.getUTCDate().toString().padStart(2, "0")}`
    const statbookFileName = `${jsonStatbook.teams.home.league}-${jsonStatbook.teams.home.name}_Vs_${jsonStatbook.teams.away.league}-${jsonStatbook.teams.away.name}_${statbookDateFormatted}.json`
    const storageResult = await storage.writeFileData(statbookFileName.toLowerCase(), JSON.stringify(jsonStatbook), {ContentType: "application/json"});
    console.info(`Statbook converted`, storageResult);
}