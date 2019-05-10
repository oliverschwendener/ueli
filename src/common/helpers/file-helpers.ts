import { Stats, readdir, lstat, unlink, exists, writeFile, existsSync, mkdirSync, readFile } from "fs";
import { join, extname } from "path";

interface FileStat {
    filePath: string;
    stats: Stats;
}

function isPackageFile(filePath: string): boolean {
    return extname(filePath) === ".app"
        || extname(filePath) === ".prefPane";
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

    public static readFilesFromFolder(folerPath: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            readdir(folerPath, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files.map((file) => join(folerPath, file)));
                }
            });
        });
    }

    public static readFilesFromFoldersRecursively(folderPaths: string[]): Promise<string[]> {
        return new Promise((resolve, reject) => {
            Promise.all(folderPaths.map((folderPath) => this.readFilesFromFolderRecursively(folderPath)))
                .then((fileLists) => {
                    let result: string[] = [];
                    fileLists.forEach((fileList) => result = result.concat(fileList));
                    resolve(result);
                })
                .catch((err) => reject(err));
        });
    }

    public static readFilesFromFolderRecursively(folderPath: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            readdir(folderPath, (readDirError, readDirResult) => {
                if (readDirError) {
                    reject(readDirError);
                } else {
                    const statPromises = readDirResult
                        .map((file) => join(folderPath, file))
                        .map((filePath) => this.getStats(filePath));

                    Promise.all(statPromises)
                        .then((statLists) => {
                            let fileStats: FileStat[] = [];
                            statLists.forEach((statList) => {
                                fileStats = fileStats.concat(statList);
                            });

                            const fileHandles = fileStats.map((fileStat) => {
                                return this.handleFileStat(fileStat);
                            });

                            Promise.all(fileHandles)
                                .then((fileLists) => {
                                    let files: string[] = [];
                                    fileLists.forEach((fileList) => {
                                        files = files.concat(fileList);
                                    });
                                    resolve(files);
                                })
                                .catch((fileHandleError) => reject(fileHandleError));
                        })
                        .catch((statError) => reject(statError));
                }
            });
        });
    }

    public static getFilesFromFolder(folderPath: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            readdir(folderPath, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files);
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

    public static fileExists(filePath: string): Promise<boolean> {
        return new Promise((resolve) => {
            exists(filePath, (fileExists) => {
                resolve(fileExists);
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

    private static handleFileStat(fileStat: FileStat): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const isFile = fileStat.stats.isFile() || isPackageFile(fileStat.filePath);
            const isDirectory = fileStat.stats.isDirectory();

            if (isFile) {
                resolve([fileStat.filePath]);
            } else if (isDirectory) {
                this.readFilesFromFolderRecursively(fileStat.filePath)
                    .then((f) => resolve(f))
                    .catch((err) => reject(err));
            } else {
                resolve([]);
            }
        });
    }
}
