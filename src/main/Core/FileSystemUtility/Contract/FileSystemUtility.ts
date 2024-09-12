export interface FileSystemUtility {
    createFolderIfDoesntExist(folderPath: string): Promise<void>;
    clearFolder(folderPath: string): Promise<void>;
    pathExists(fileOrFolderPath: string): Promise<boolean>;
    readFileSync(filePath: string): Buffer;
    readFile(filePath: string): Promise<Buffer>;
    readTextFileSync(filePath: string): string;
    readTextFile(filePath: string): Promise<string>;
    readJsonFile<T>(filePath: string): Promise<T>;
    readJsonFileSync<T>(filePath: string): T;
    readXmlFile<T>(filePath: string): Promise<T>;
    readXmlFileSync<T>(filePath: string): T;
    readDirectory(folderPath: string, recursive?: boolean): Promise<string[]>;
    removeFile(filePath: string): Promise<void>;
    writeTextFile(data: string, filePath: string): Promise<void>;
    writeJsonFile<T>(data: T, filePath: string): Promise<void>;
    writeJsonFileSync<T>(data: T, filePath: string): void;
    existsSync(filePath: string): boolean;
    isAccessibleSync(filePath: string): boolean;
    isDirectory(filePath: string): boolean;
    copyFile(filePath: string, destinationFilePath: string): Promise<void>;
}
