import { Stats, readdir, lstat, unlink, exists } from "fs";
import { join, extname } from "path";

interface FileStat {
    filePath: string;
    stats: Stats;
}

export class FileHelpers {
    public static readFilesFromFoldersRecursively(folderPaths: string[]): Promise<string[]> {
        return new Promise((resolve, reject) => {
            Promise.all(folderPaths.map((folderPath) => this.readFilesFromFolderRecursively(folderPath)))
                .then((fileLists) => {
                    let result: string[] = [];
                    fileLists.forEach((fileList) => result = result.concat(fileList));
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
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
                        .map((filePath) => {
                            return this.getStats(filePath);
                        });

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
                                .catch((fileHandleError) => {
                                    reject(fileHandleError);
                                });
                        })
                        .catch((statError) => {
                            reject(readDirError);
                        });
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

    private static handleFileStat(fileStat: FileStat): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const isFile = fileStat.stats.isFile() || extname(fileStat.filePath) === ".app";
            const isDirectory = fileStat.stats.isDirectory();

            if (isFile) {
                resolve([fileStat.filePath]);
            } else if (isDirectory) {
                this.readFilesFromFolderRecursively(fileStat.filePath)
                    .then((f) => {
                        resolve(f);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            } else {
                resolve([]);
            }
        });
    }
}
