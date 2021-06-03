export interface FileBrowserOptions {
    isEnabled: boolean;
    maxSearchResults: number;
    showFullFilePath: boolean;
    showHiddenFiles: boolean;
    blackList: string[];
}

export const defaultFileBrowserOptions: FileBrowserOptions = {
    blackList: ["desktop.ini"],
    isEnabled: false,
    maxSearchResults: 100,
    showFullFilePath: true,
    showHiddenFiles: false,
};
