import { Stats, Dirent, existsSync, mkdirSync, promises} from "fs";
import { join, extname, resolve } from "path";
const {access, lstat, readdir, readFile, unlink, writeFile} = promises;

interface FileStat {
    filePath: string;
    stats: Stats;
}

function isPackageFile(filePath: string): boolean {
    return extname(filePath) === ".app"
        || extname(filePath) === ".prefPane";
}

export class FileHelpers {
    public static async readFile(filePath: string): Promise<string> {
        try {
            const fileExists = await this.fileExists(filePath);
            if (fileExists) {
                const data = await readFile(filePath);
                return data.toString("utf8");
            } else {
                throw new Error(`File "${filePath} does not exist"`);
            }
        } catch (error) {
            return error;
        }
    }

    public static async readFilesFromFolder(folderPath: string, excludeHiddenFiles?: boolean): Promise<string[]> {
        try {
            const files = await readdir(folderPath);
            const result = files
                .filter((file: string) => {
                    if (excludeHiddenFiles) {
                        return !this.isHiddenFile(file);
                    } else {
                        return true;
                    }
                })
                .map((file: string) => join(folderPath, file));
            return result;
        } catch (error) {
            return error;
        }
    }

    public static async readFilesFromFoldersRecursively(folderPaths: string[], excludeHiddenFiles?: boolean): Promise<string[]> {
        try {
            const allFilesPromises = folderPaths.map((folderPath) => {
                return this.readFilesFromFolderRecursively(folderPath, excludeHiddenFiles);
            }).flat(Infinity);
            const filePaths = (await Promise.all(allFilesPromises)).flat(Infinity);
            return filePaths;
        } catch (error) {
            return error;
        }
    }

    public static async readFilesFromFolderRecursively(folderPath: string, excludeHiddenFiles?: boolean): Promise<string[]> {
        try {
            let files: Dirent[] = await readdir(folderPath, {withFileTypes: true});
            if (excludeHiddenFiles) {
                files = files.filter((file) => FileHelpers.isHiddenFile(file.name));
            }
            const allFilesPromises = files.map(async (file) => {
                const filePath = resolve(folderPath, file.name);
                // this check needs to go first since `.app` & `.prefPane` are directories, but we want to treat them as files & not traverse them.
                if (file.isFile() || isPackageFile(file.name)) {
                    return filePath;
                } else if (file.isDirectory()) {
                    return this.readFilesFromFolderRecursively(filePath);
                } else {
                    return [];
                }
            });
            const filePaths = (await Promise.all(allFilesPromises)).flat(Infinity);
            return filePaths;
        } catch (error) {
            return error;
        }
    }

    public static async deleteFile(filePath: string): Promise<void> {
        try {
            await unlink(filePath);
        } catch (error) {
            return error;
        }
    }

    public static async fileExists(filePath: string): Promise<boolean> {
        try {
            const fileExists = (await access(filePath)) === undefined;
            return fileExists;
        } catch (error) {
            return error;
        }
    }

    public static async getStats(filePath: string): Promise<FileStat> {
        try {
            const stats = await lstat(filePath);
            return {
                filePath,
                stats,
            };
        } catch (error) {
            return error;
        }
    }

    public static async writeFile(filePath: string, fileContent: string): Promise<void> {
        try {
            await writeFile(filePath, fileContent);
        } catch (error) {
            return error;
        }
    }

    public static fileExistsSync(filePath: string): boolean {
        return existsSync(filePath);
    }

    public static createFolderSync(filePath: string) {
        mkdirSync(filePath);
    }

    private static isHiddenFile(fileName: string): boolean {
        return fileName[0] === ".";
    }
}
