import { existsSync, readFileSync, unlink, writeFileSync } from "fs";
import { emptyDir, ensureDir, pathExists, readFile, readdir, rmdir, writeFile } from "fs-extra";
import { join } from "path";
import type { FileSystemUtility } from "./FileSystemUtility";

export class RealFileSystemUtility implements FileSystemUtility {
    public createFolderIfDoesntExist(folderPath: string): Promise<void> {
        return ensureDir(folderPath);
    }

    public async deleteFolderRecursively(folderPath: string): Promise<void> {
        await this.cleanFolder(folderPath);
        return rmdir(folderPath);
    }

    public cleanFolder(folderPath: string): Promise<void> {
        return emptyDir(folderPath);
    }

    public pathExists(fileOrFolderPath: string): Promise<boolean> {
        return pathExists(fileOrFolderPath);
    }

    public getFolderItems(folderPath: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            readdir(folderPath, (error, fileNames) => {
                error ? reject(error) : resolve(fileNames.map((fileName): string => join(folderPath, fileName)));
            });
        });
    }

    public async readJsonFile<T>(filePath: string): Promise<T> {
        const fileContent = await this.readFile(filePath);
        return JSON.parse(fileContent.toString());
    }

    public readJsonFileSync<T>(filePath: string): T {
        return JSON.parse(this.readFileSync(filePath).toString());
    }

    public removeFile(filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            unlink(filePath, (error) => {
                error ? reject(error) : resolve();
            });
        });
    }

    public writeTextFile(data: string, filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            writeFile(filePath, data, "utf-8", (error) => {
                error ? reject(error) : resolve();
            });
        });
    }

    public writeJsonFile<T>(data: T, filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            writeFile(filePath, JSON.stringify(data), (error) => {
                error ? reject(error) : resolve();
            });
        });
    }

    public writeJsonFileSync<T>(data: T, filePath: string): void {
        return writeFileSync(filePath, JSON.stringify(data));
    }

    public writePng(buffer: Buffer, filePath: string): Promise<void> {
        return writeFile(filePath, buffer);
    }

    public existsSync(filePath: string): boolean {
        return existsSync(filePath);
    }

    private readFile(filePath: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            readFile(filePath, (error, data) => {
                error ? reject(error) : resolve(data);
            });
        });
    }

    private readFileSync(filePath: string): Buffer {
        return readFileSync(filePath);
    }
}
