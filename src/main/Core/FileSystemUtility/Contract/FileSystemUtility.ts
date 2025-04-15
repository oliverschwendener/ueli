export interface FileSystemUtility {
    createFolderIfDoesntExist(folderPath: string): Promise<void>;
    clearFolder(folderPath: string): Promise<void>;
    pathExists(fileOrFolderPath: string): Promise<boolean>;
    readFileSync(filePath: string): Buffer;
    readFile(filePath: string): Promise<Buffer>;
    readTextFileSync(filePath: string, encoding?: BufferEncoding): string;
    readTextFile(filePath: string, encoding?: BufferEncoding): Promise<string>;
    readJsonFile<T>(filePath: string): Promise<T>;
    readJsonFileSync<T>(filePath: string): T;
    readDirectory(folderPath: string, recursive?: boolean): Promise<string[]>;
    readDirectorySync(folderPath: string, recursive?: boolean): string[];
    removeFile(filePath: string): Promise<void>;
    removeFileSync(filePath: string): void;
    writeFile(data: Buffer, filePath: string): Promise<void>;
    writeTextFile(data: string, filePath: string): Promise<void>;
    writeJsonFile<T>(data: T, filePath: string): Promise<void>;
    writeJsonFileSync<T>(data: T, filePath: string): void;
    existsSync(filePath: string): boolean;
    isAccessibleSync(filePath: string): boolean;
    isDirectory(filePath: string): boolean;
    copyFile(filePath: string, destinationFilePath: string): Promise<void>;
}
