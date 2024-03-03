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

    public async readIniFile(filePath: string): Promise<Record<string, Record<string, string>>> {
        return this.parseIni((await this.readFile(filePath)).toString());
    }

    public readIniFileSync(filePath: string): Record<string, Record<string, string>> {
        return this.parseIni(this.readFileSync(filePath).toString());
    }

    public copyFile(srcPath: string, destPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            copyFile(srcPath, destPath, (error) => {
                error ? reject(error) : resolve();
            });
        });
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
                error ? reject(error) : resolve();
            });
        });
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

    private readDirectory(folderPath: string): Promise<string[]> {
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

    private parseIni(fileString: string): Record<string, Record<string, string>> {
        const fileContent = fileString.split("\n").filter((v) => !v.startsWith("#") && v !== "");
        const entries: Record<string, Record<string, string>> = {};
        let group = "";
        entries[group] = {};
        for (const line of fileContent) {
            // Comments
            if (line.startsWith('#') || line === "") continue;
            // New group
            if (line.startsWith("[") && line.endsWith("]") && !line.slice(1, -1).match(/\[\]/m)) {
                if (entries[line]) throw `Ini Format Error! Duplicate groups found in ${fileString}`;
                group = line.slice(1, -1);
                entries[group] = {};
            } else {
                // Entry
                const [key, ...entrySplit] = line.split('=')
                const entry = entrySplit.join('=');
                if (entries[group][key]) throw `Ini Format Error! Duplicate key in ${group} in file ${fileString}`;
                entries[group][key] = entry;
            }
        }
        return entries;
    }
}
