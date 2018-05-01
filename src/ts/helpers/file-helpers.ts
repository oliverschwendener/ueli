import * as fs from "fs";
import * as path from "path";
import { Config } from "../config";

export class FileHelpers {
    public static getFilesFromFolderRecursively(folderPath: string): string[] {
        try {
            let result = [] as string[];
            const fileNames = fs.readdirSync(folderPath);

            const validFileNames = fileNames.filter((fileName) => {
                return this.isValidFile(fileName);
            });

            for (const fileName of validFileNames) {
                try {
                    const filePath = path.join(folderPath, fileName);
                    const stats = fs.lstatSync(filePath);

                    if (stats.isDirectory()) {
                        // treat .app folder as a file
                        // because going recursively through the app folder on macOS would cause longer scan times
                        if (filePath.endsWith(".app")) {
                            result.push(filePath);
                        } else {
                            result = result.concat(FileHelpers.getFilesFromFolderRecursively(filePath));
                        }
                    } else if (stats.isFile()) {
                        result.push(filePath);
                    }
                } catch (error) {
                    continue;
                }
            }

            return result;

        } catch (error) {
            return [];
        }
    }

    public static getFilesFromFolder(folderPath: string): string[] {
        try {
            const fileNames = fs.readdirSync(folderPath);

            const validFileNames = fileNames.filter((fileName) => this.isValidFile(fileName));

            const filePaths = validFileNames.map((f): string => {
                return path.join(folderPath, f);
            });

            const accessibleFiles = filePaths.map((filePath) => {
                try {
                    fs.lstatSync(filePath);
                    return filePath;
                } catch (err) {
                    // do nothing
                }
            }).filter((maybe) => maybe !== undefined) as string[];

            return accessibleFiles;
        } catch (error) {
            return [];
        }
    }

    public static getFilesFromFoldersRecursively(folderPaths: string[]): string[] {
        const result = folderPaths.map((folderPath) => {
            return FileHelpers.getFilesFromFolderRecursively(folderPath);
        }).reduce((acc, files) => acc.concat(files));

        return result;
    }

    private static isValidFile(fileName: string): boolean {
        if (Config.showHiddenFiles) {
            return true;
        } else {
            return !fileName.startsWith(".");
        }
    }
}
