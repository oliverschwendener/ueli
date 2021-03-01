import { Stats, readdir, lstat, unlink, exists, writeFile, existsSync, mkdirSync, readFile } from "fs";
import { join } from "path";

interface FileStat {
    filePath: string;
    stats: Stats;
}

interface FileExitsResult {
    filePath: string;
    fileExists: boolean;
}

export class FileHelpers {
    public static readFile(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.fileExists(filePath)
                .then((fileExists) => {
                    if (fileExists) {
                        readFile(filePath, (err, data) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(data.toString("utf8"));
                            }
                        });
                    } else {
                        reject(`File "${filePath} does not exist"`);
                    }
                })
                .catch((err) => reject(err));
        });
    }

    public static readFilesFromFolder(folderPath: string, excludeHiddenFiles?: boolean): Promise<string[]> {
        return new Promise((resolve, reject) => {
            readdir(folderPath, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    const result = files
                        .filter((file) => {
                            if (excludeHiddenFiles) {
                                return !this.isHiddenFile(file);
                            } else {
                                return true;
                            }
                        })
                        .map((file) => join(folderPath, file));

                    resolve(result);
                }
            });
        });
    }

    public static deleteFile(filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            unlink(filePath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public static fileExists(filePath: string): Promise<FileExitsResult> {
        return new Promise((resolve) => {
            exists(filePath, (fileExists) => {
                resolve({ fileExists, filePath });
            });
        });
    }

    public static getStats(filePath: string): Promise<FileStat> {
        return new Promise((resolve, reject) => {
            lstat(filePath, (err, stats) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        filePath,
                        stats,
                    });
                }
            });
        });
    }

    public static writeFile(filePath: string, fileContent: string): Promise<void> {
        return new Promise((resolve, reject) => {
            writeFile(filePath, fileContent, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public static fileExistsSync(filePath: string): boolean {
        return existsSync(filePath);
    }

    public static createFolderSync(filePath: string) {
        mkdirSync(filePath);
    }

    private static isHiddenFile(fileName: string): boolean {
        return fileName.startsWith(".");
    }
}
