import * as fs from "fs";
import * as path from "path";
import { Config } from "../config";

export class FileHelpers {
    public static getFilesFromFolderRecursively(folderPath: string): string[] {
        let result = [] as string[];

        const fileNames = fs.readdirSync(folderPath);

        const validFileNames = fileNames.filter((fileName) => {
            return this.isValidFile(fileName);
        });

        for (const fileName of validFileNames) {
            const filePath = path.join(folderPath, fileName);

            if (!fs.existsSync(filePath)) {
                continue;
            }

            const stats = fs.lstatSync(filePath);

            if (stats.isDirectory()) {
                // treat .app folder as a file
                // because going recursively through the app folder (on macOS) would cause longer scan time
                if (filePath.endsWith(".app")) {
                    result.push(filePath);
                } else {
                    result = result.concat(FileHelpers.getFilesFromFolderRecursively(filePath));
                }
            } else if (stats.isFile()) {
                result.push(filePath);
            }
        }

        return result;
    }

    public static getFilesFromFolder(folderPath: string): string[] {
        const fileNames = fs.readdirSync(folderPath);

        const validFileNames = fileNames.filter((fileName) => {
            return this.isValidFile(fileName);
        });

        const filePaths = validFileNames.map((f): string => {
            return path.join(folderPath, f);
        });

        const accessibleFiles = [];

        for (const filePath of filePaths) {
            try {
                fs.lstatSync(filePath);
                accessibleFiles.push(filePath);
            } catch (err) {
                // do nothing
            }
        }

        return accessibleFiles;
    }

    public static getFilesFromFoldersRecursively(folderPaths: string[]): string[] {
        let result = [] as string[];

        for (const folderPath of folderPaths) {
            result = result.concat(FileHelpers.getFilesFromFolderRecursively(folderPath));
        }

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
