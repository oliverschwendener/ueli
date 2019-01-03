import { ApplicationRepository } from "./application-repository";
import { Application } from "./application";
import { basename, extname, join } from "path";
import { ApplicationSearchPluginOptions } from "./application-search-plugin-options";
import { readdir, lstat, Stats } from "fs";

interface FileStat {
    filePath: string;
    stats: Stats;
}

export class FileApplicationRepository implements ApplicationRepository {
    private programs: Application[];
    private config: ApplicationSearchPluginOptions;

    constructor(config: ApplicationSearchPluginOptions) {
        this.programs = [];
        this.config = config;
    }

    public getAll(): Promise<Application[]> {
        return new Promise((resolve, reject) => {
            resolve(this.programs);
        });
    }

    public refreshIndex(): void {
        const promises = this.config.applicationFolders.map((applicationFolder) => {
            return this.readFilesFromFolderRecursively(applicationFolder);
        });

        Promise.all(promises).then((fileLists) => {
            let files: string[] = [];
            fileLists.forEach((fileList) => {
                files = files.concat(fileList);
            });

            this.programs = [];
            files
                .filter((file) => this.filterByApplicationFileExtensions(file))
                .forEach((file) => this.programs.push(this.createProgramFromFilePath(file)));
        });
    }

    private readFilesFromFolderRecursively(folderPath: string): Promise<string[]> {
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

    private handleFileStat(fileStat: FileStat): Promise<string[]> {
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

    private getStats(filePath: string): Promise<FileStat> {
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

    private createProgramFromFilePath(filePath: string): Application {
        return {
            filePath,
            name: basename(filePath).replace(extname(filePath), ""),
        };
    }

    private filterByApplicationFileExtensions(file: string): boolean {
        return this.config.applicationFileExtensions.indexOf(extname(file)) > -1;
    }
}
