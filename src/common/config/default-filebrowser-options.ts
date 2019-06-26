import { FileBrowserOptions } from "./filebrowser-options";

export const defaultFileBrowserOptions: FileBrowserOptions = {
    blackList: [
        "desktop.ini",
    ],
    isEnabled: false,
    maxSearchResults: 100,
    showFullFilePath: true,
    showHiddenFiles: false,
};
