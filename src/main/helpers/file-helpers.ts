import { Stats, readdir, lstat } from "fs";
import { join, extname } from "path";

interface FileStat {
    filePath: string;
    stats: Stats;
}

export class FileHelpers {
    public static readFilesFromFolderRecursively(folderPath: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            readdir(folderPath, (err, readDirResult) => {
                if (err) {
                    // tslint:disable-next-line:no-console
                    console.log(err);
                } else {
                    const statPromises = readDirResult
                        .map((file) => join(folderPath, file))
                        .map((filePath) => {
                            return this.getStats(filePath);
                        });

                    Promise.all(statPromises).then((statLists) => {
                        let fileStats: FileStat[] = [];
                        statLists.forEach((statList) => {
                            fileStats = fileStats.concat(statList);
                        });

                        const fileHandles = fileStats.map((fileStat) => {
                            return this.handleFileStat(fileStat);
                        });

                        Promise.all(fileHandles).then((fileLists) => {
                            let files: string[] = [];
                            fileLists.forEach((fileList) => {
                                files = files.concat(fileList);
                            });

                            resolve(files);
                        });
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

    private static getStats(filePath: string): Promise<FileStat> {
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
}
