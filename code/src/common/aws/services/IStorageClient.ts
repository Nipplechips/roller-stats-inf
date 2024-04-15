interface IStorageClient{
    getFileData(fileName: string, reviver?: (this: any, key: string, value: any) => any): Promise<any>;
    writeFileData(fileName: string, fileData: string, extras?:any): Promise<any>;
    getPresignedUrl(commandName: string, params: {Key: string}): Promise<string>;
    listKeys(pathPrefix?:string): Promise<string[]>;
}

export {IStorageClient}