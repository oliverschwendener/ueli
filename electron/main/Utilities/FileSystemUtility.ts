export interface FileSystemUtility {
    createFolderIfDoesntExist(folderPath: string): Promise<void>;
    deleteFolderRecursively(folderPath: string): Promise<void>;
    cleanFolder(folderPath: string): Promise<void>;
    pathExists(fileOrFolderPath: string): Promise<boolean>;
    getFolderItems(folderPath: string): Promise<string[]>;
    readJsonFile<T>(filePath: string): Promise<T>;
    readJsonFileSync<T>(filePath: string): T;
    writeJsonFile<T>(data: T, filePath: string): Promise<void>;
    writeJsonFileSync<T>(data: T, filePath: string): void;
    writePng(buffer: Buffer, filePath: string): Promise<void>;
    existsSync(filePath: string): boolean;
}
