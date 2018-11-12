import { lstatSync, readdirSync, existsSync } from "fs";
import { join } from "path";

export class FileHelpers {
    public static getFilesFromFolderRecursively(folderPath: string, blackList: string[], includeFolders?: boolean, actionBeforeEachFile?: (filePath: string) => void): string[] {
        let result = [] as string[];

        if (!existsSync(folderPath)) {
            return result;
        }

        const fileNames = FileHelpers.getFileNamesFromFolder(folderPath);
        const filteredFileNames = FileHelpers.filterBlackList(fileNames, blackList);

        for (const fileName of filteredFileNames) {
            try {
                const filePath = join(folderPath, fileName);

                if (actionBeforeEachFile !== undefined) {
                    actionBeforeEachFile(filePath);
                }

                const stats = lstatSync(filePath);
                const isDirecotry = stats.isDirectory();
                const isFile = stats.isFile();

                if (isDirecotry && !isFile) {
                    // treat .app folder as a file because going recursively through the app folder on macOS would cause the scan to take insanely long
                    if (filePath.endsWith(".app")) {
                        result.push(filePath);
                    } else {
                        if (includeFolders !== undefined && includeFolders) {
                            result.push(filePath);
                        }
                        result = result.concat(FileHelpers.getFilesFromFolderRecursively(filePath, blackList, includeFolders, actionBeforeEachFile));
                    }
                }
                if (!isDirecotry && isFile) {
                    result.push(filePath);
                }
            } catch (error) {
                continue;
            }
        }

        return result;
    }

    public static getFilesFromFolder(folderPath: string): string[] {
        try {
            const fileNames = FileHelpers.getFileNamesFromFolder(folderPath);

            const filePaths = fileNames.map((f): string => {
                return join(folderPath, f);
            });

            const accessibleFiles = filePaths.map((filePath): string | undefined => {
                try {
                    lstatSync(filePath);
                    return filePath;
                } catch (err) {
                    // do nothing
                }
            }).filter((maybe): boolean => maybe !== undefined) as string[];

            return accessibleFiles;
        } catch (error) {
            return [];
        }
    }

    public static getFilesFromFoldersRecursively(folderPaths: string[], blackList: string[]): string[] {
        let result = [] as string[];

        for (const folderPath of folderPaths) {
            result = result.concat(FileHelpers.getFilesFromFolderRecursively(folderPath, blackList));
        }

        return result;
    }

    private static getFileNamesFromFolder(folderPath: string): string[] {
        const allFiles = readdirSync(folderPath);

        const visibleFiles = allFiles.filter((fileName): boolean => {
            return !fileName.startsWith(".");
        });

        return visibleFiles;
    }

    private static filterBlackList(fileNames: string[], blackList: string[]): string[] {
        return fileNames.filter((fileName: string): boolean => {
            return blackList.filter((blackListEntry: string): boolean => {
                return blackListEntry === fileName;
            }).length === 0;
        });
    }
}
