import * as fs from "fs";
import * as path from "path";

export class FileHelpers {
    public static getFilesFromFolderRecursively(folderPath: string): string[] {
        try {
            let result = [] as string[];
            const fileNames = fs.readdirSync(folderPath);

            for (const fileName of fileNames) {
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

            const filePaths = fileNames.map((f): string => {
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
}
