import { ProgramRepository } from "./program-repository";
import { Program } from "./program";
import { readdir, lstatSync } from "fs";
import { join, basename, extname } from "path";
import { homedir } from "os";

export class WindowsProgramRepository implements ProgramRepository {
    private programs: Program[];
    private readonly programFolders = [
        "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs",
        `${homedir()}\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu`,
    ];
    private readonly programFileExtensions = [
        ".lnk",
    ];

    constructor() {
        this.programs = [];
    }

    public getAll(): Promise<Program[]> {
        return new Promise((resolve, reject) => {
            resolve(this.programs);
        });
    }

    public refreshIndex(): void {
        this.programFolders.forEach((programFolder) => {
            this.readFilesFromFolderRecursively(programFolder)
                .then((files) => {
                    this.programs = [];
                    files.forEach((file) => this.programs.push(this.createProgramFromFilePath(file)));
                })
                .catch((err) => {
                    // tslint:disable-next-line:no-console
                    console.log(err);
                });
        });
    }

    private readFilesFromFolderRecursively(folderPath: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            let filePaths: string[] = [];
            readdir(folderPath, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    for (const file of files) {
                        const filePath = join(folderPath, file);
                        const stats = lstatSync(filePath);
                        if (stats.isDirectory() && !stats.isSymbolicLink()) {
                            // tslint:disable-next-line:no-console
                            console.log(`subfolder: ${filePath}`);
                            // this.readFilesFromFolderRecursively(filePath)
                            //     .then((filesOfSubfolder) => {
                            //         filePaths = filePaths.concat(filesOfSubfolder);
                            //     });
                        } else if (stats.isFile() && !stats.isSymbolicLink()) {
                            if (this.fileHasAllowedFileExtension(filePath)) {
                                filePaths.push(filePath);
                            }
                        }
                    }
                    resolve(filePaths);
                }
            });
        });
    }

    private createProgramFromFilePath(filePath: string): Program {
        return {
            filePath,
            name: basename(filePath).replace(extname(filePath), ""),
        };
    }

    private fileHasAllowedFileExtension(filePath: string): boolean {
        this.programFileExtensions.forEach((p) => {
            if (extname(filePath) === p) {
                return true;
            }
        });

        return false;
    }
}
