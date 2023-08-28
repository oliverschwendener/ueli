import { existsSync, readFileSync, writeFileSync } from "fs";
import { emptyDir, ensureDir, pathExists, readFile, readdir, rmdir, writeFile } from "fs-extra";
import { join } from "path";

export class FileSystemUtility {
    public static createFolderIfDoesntExist(folderPath: string): Promise<void> {
        return ensureDir(folderPath);
    }

    public static async deleteFolderRecursively(folderPath: string): Promise<void> {
        await this.cleanFolder(folderPath);
        return rmdir(folderPath);
    }

    public static cleanFolder(folderPath: string): Promise<void> {
        return emptyDir(folderPath);
    }

    public static pathExists(fileOrFolderPath: string): Promise<boolean> {
        return pathExists(fileOrFolderPath);
    }

    public static getFolderItems(folderPath: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            readdir(folderPath, (error, fileNames) => {
                error ? reject(error) : resolve(fileNames.map((fileName): string => join(folderPath, fileName)));
            });
        });
    }

    public static async readJsonFile<T>(filePath: string): Promise<T> {
        const fileContent = await this.readFile(filePath);
        return JSON.parse(fileContent.toString());
    }

    public static readJsonFileSync<T>(filePath: string): T {
        return JSON.parse(this.readFileSync(filePath).toString());
    }

    public static writeJsonFile<T>(data: T, filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            writeFile(filePath, JSON.stringify(data), (error) => {
                error ? reject(error) : resolve();
            });
        });
    }

    public static writeJsonFileSync<T>(data: T, filePath: string): void {
        return writeFileSync(filePath, JSON.stringify(data));
    }

    public static writePng(buffer: Buffer, filePath: string): Promise<void> {
        return writeFile(filePath, buffer);
    }

    public static existsSync(filePath: string): boolean {
        return existsSync(filePath);
    }

    private static readFile(filePath: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            readFile(filePath, (error, data) => {
                error ? reject(error) : resolve(data);
            });
        });
    }

    private static readFileSync(filePath: string): Buffer {
        return readFileSync(filePath);
    }
}
