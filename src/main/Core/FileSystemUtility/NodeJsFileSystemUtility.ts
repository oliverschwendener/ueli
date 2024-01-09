import { access, existsSync, mkdir, readFile, readFileSync, unlink, writeFile, writeFileSync } from "fs";
import type { FileSystemUtility } from "./Contract";

export class NodeJsFileSystemUtility implements FileSystemUtility {
    public async createFolderIfDoesntExist(folderPath: string): Promise<void> {
        const exists = await this.pathExists(folderPath);

        if (!exists) {
            await this.createFolder(folderPath);
        }
    }

    public pathExists(fileOrFolderPath: string): Promise<boolean> {
        return new Promise((resolve) => access(fileOrFolderPath, (error) => resolve(!error)));
    }

    public createFolder(folderPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            mkdir(folderPath, (error) => {
                error ? reject(error) : resolve();
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
        return new Promise((resolve, reject) => {
            writeFile(filePath, buffer, (error) => {
                error ? reject(error) : resolve();
            });
        });
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
