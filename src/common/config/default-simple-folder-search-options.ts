import { SimpleFolderSearchOptions } from "./simple-folder-search-options";
import { homedir } from "os";

export const defaultSimpleFolderSearchOptions: SimpleFolderSearchOptions = {
    folders: [
        {
            excludeHiddenFiles: false,
            folderPath: homedir(),
            recursive: false,
        },
    ],
    isEnabled: true,
};
