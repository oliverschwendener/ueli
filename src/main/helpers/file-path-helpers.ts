import { basename, dirname } from "path";
import { FilePathOptions } from "../folder-path-options";

export function createFilePathDescription(filePath: string, options?: FilePathOptions): string {
    const showFullFilePath = options ? options.showFullFilePath : true;

    if (showFullFilePath) {
        return filePath;
    } else {
        const parentDirectoryName = basename(dirname(filePath));
        return parentDirectoryName ? `${parentDirectoryName} ▸ ${basename(filePath)}` : basename(filePath);
    }
}
