import { basename, dirname } from "path";
import { UeliHelpers } from "../helpers/ueli-helpers";

export class FilePathDescriptionBuilder {
    public static buildFilePathDescription(filePath: string): string {
        const parentDirName = basename(dirname(filePath));
        const fileName = basename(filePath);

        return parentDirName === undefined || parentDirName.length === 0
            ? fileName
            : `${parentDirName} ${UeliHelpers.searchResultDescriptionSeparator} ${fileName}`;
    }
}
