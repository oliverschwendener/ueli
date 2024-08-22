import {
    access,
    accessSync,
    copyFile,
    existsSync,
    mkdir,
    readFile,
    readFileSync,
    readdir,
    statSync,
    unlink,
    writeFile,
    writeFileSync,
} from "fs";
import { join } from "path";
import type { FileSystemUtility } from "./Contract";

export class NodeJsFileSystemUtility implements FileSystemUtility {
    public async clearFolder(folderPath: string): Promise<void> {
        const filePaths = await this.readDirectory(folderPath);
        await Promise.all(filePaths.map((filePath) => this.removeFile(filePath)));
    }

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
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    public async readJsonFile<T>(filePath: string): Promise<T> {
        const fileContent = await this.readTextFile(filePath);
        return JSON.parse(fileContent);
    }

    public readJsonFileSync<T>(filePath: string): T {
        return JSON.parse(this.readTextFileSync(filePath));
    }

    public removeFile(filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            unlink(filePath, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    public writeTextFile(data: string, filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            writeFile(filePath, data, "utf-8", (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    public writeJsonFile<T>(data: T, filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            writeFile(filePath, JSON.stringify(data), (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    public writeJsonFileSync<T>(data: T, filePath: string): void {
        return writeFileSync(filePath, JSON.stringify(data));
    }

    public writePng(buffer: Buffer, filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            writeFile(filePath, buffer, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    public existsSync(filePath: string): boolean {
        return existsSync(filePath);
    }

    public isAccessibleSync(filePath: string): boolean {
        try {
            accessSync(filePath);
            return true;
        } catch (error) {
            return false;
        }
    }

    public isDirectory(filePath: string): boolean {
        try {
            return statSync(filePath).isDirectory();
        } catch (error) {
            return false;
        }
    }

    public copyFile(filePath: string, destinationFilePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            copyFile(filePath, destinationFilePath, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    public readFile(filePath: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            readFile(filePath, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    }

    public readFileSync(filePath: string): Buffer {
        return readFileSync(filePath);
    }

    public readTextFileSync(filePath: string): string {
        return this.readFileSync(filePath).toString();
    }

    public async readTextFile(filePath: string): Promise<string> {
        return (await this.readFile(filePath)).toString();
    }

    public async readDirectory(folderPath: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            readdir(folderPath, (error, fileNames) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(fileNames.map((fileName) => join(folderPath, fileName)));
                }
            });
        });
    }
}
