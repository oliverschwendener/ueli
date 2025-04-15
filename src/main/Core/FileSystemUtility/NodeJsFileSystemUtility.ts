import { access, accessSync, existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "fs";
import { copyFile, writeFile as fsWriteFile, mkdir, readdir, readFile, rm } from "fs/promises";
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

    public async createFolder(folderPath: string): Promise<void> {
        await mkdir(folderPath, { recursive: true });
    }

    public async readJsonFile<T>(filePath: string): Promise<T> {
        const fileContent = await this.readTextFile(filePath);
        return JSON.parse(fileContent);
    }

    public readJsonFileSync<T>(filePath: string): T {
        const fileContent = this.readTextFileSync(filePath);
        return JSON.parse(fileContent);
    }

    public async removeFile(filePath: string): Promise<void> {
        await rm(filePath, { recursive: true });
    }

    public removeFileSync(filePath: string): void {
        rmSync(filePath, { recursive: true });
    }

    public async writeFile(data: Buffer, filePath: string): Promise<void> {
        await fsWriteFile(filePath, data);
    }

    public async writeTextFile(data: string, filePath: string): Promise<void> {
        await fsWriteFile(filePath, data, "utf-8");
    }

    public async writeJsonFile<T>(data: T, filePath: string): Promise<void> {
        await this.writeTextFile(JSON.stringify(data), filePath);
    }

    public writeJsonFileSync<T>(data: T, filePath: string): void {
        return writeFileSync(filePath, JSON.stringify(data));
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

    public async copyFile(filePath: string, destinationFilePath: string): Promise<void> {
        await copyFile(filePath, destinationFilePath);
    }

    public async readFile(filePath: string): Promise<Buffer> {
        return await readFile(filePath);
    }

    public readFileSync(filePath: string): Buffer {
        return readFileSync(filePath);
    }

    public readTextFileSync(filePath: string, encoding?: BufferEncoding): string {
        return this.readFileSync(filePath).toString(encoding);
    }

    public async readTextFile(filePath: string, encoding?: BufferEncoding): Promise<string> {
        return (await this.readFile(filePath)).toString(encoding);
    }

    public async readDirectory(folderPath: string, recursive?: boolean): Promise<string[]> {
        const fileNames = await readdir(folderPath, { recursive });
        return fileNames.map((fileName) => join(folderPath, fileName));
    }

    public readDirectorySync(folderPath: string, recursive?: boolean): string[] {
        const fileNames = readdirSync(folderPath, { recursive });
        return fileNames.map((fileName) => join(folderPath, fileName.toString()));
    }
}
