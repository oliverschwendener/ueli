import { lstatSync, readdirSync } from "fs";
import { join } from "path";

export class FileHelpers {
    public static getFilesFromFolderRecursively(folderPath: string, includeFolders?: boolean): string[] {
        try {
            let result = [] as string[];
            const fileNames = FileHelpers.getFileNamesFromFolder(folderPath);

            for (const fileName of fileNames) {
                try {
                    const filePath = join(folderPath, fileName);
                    const stats = lstatSync(filePath);

                    if (stats.isDirectory()) {
                        // treat .app folder as a file because going recursively through the app folder on macOS would cause the scan to take insanely long
                        if (filePath.endsWith(".app")) {
                            result.push(filePath);
                        } else {
                            if (includeFolders !== undefined && includeFolders) {
                                result.push(filePath);
                            }
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
            const fileNames = FileHelpers.getFileNamesFromFolder(folderPath);

            const filePaths = fileNames.map((f): string => {
                return join(folderPath, f);
            });

            const accessibleFiles = filePaths.map((filePath) => {
                try {
                    lstatSync(filePath);
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
        let result = [] as string[];

        for (const folderPath of folderPaths) {
            result = result.concat(FileHelpers.getFilesFromFolderRecursively(folderPath));
        }

        return result;
    }

    private static getFileNamesFromFolder(folderPath: string): string[] {
        const allFiles = readdirSync(folderPath);

        const visibleFiles = allFiles.filter((fileName) => {
            return !fileName.startsWith(".");
        });

        return visibleFiles;
    }
}
