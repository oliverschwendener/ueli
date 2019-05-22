import { basename, dirname } from "path";

export function createFilePathDescription(filePath: string): string {
    const parentDirectoryName = basename(dirname(filePath));
    return parentDirectoryName
        ? `${parentDirectoryName} ▸ ${basename(filePath)}`
        : basename(filePath);
}
