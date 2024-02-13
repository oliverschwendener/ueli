export interface FileSystemUtility {
    createFolderIfDoesntExist(folderPath: string): Promise<void>;
    pathExists(fileOrFolderPath: string): Promise<boolean>;
    readJsonFile<T>(filePath: string): Promise<T>;
    readJsonFileSync<T>(filePath: string): T;
    removeFile(filePath: string): Promise<void>;
    writeTextFile(data: string, filePath: string): Promise<void>;
    writeJsonFile<T>(data: T, filePath: string): Promise<void>;
    writeJsonFileSync<T>(data: T, filePath: string): void;
    writePng(buffer: Buffer, filePath: string): Promise<void>;
    existsSync(filePath: string): boolean;
    isDirectory(filePath: string): boolean;
}
