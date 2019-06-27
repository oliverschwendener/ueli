export interface SimpleFolderSearchOptions {
    isEnabled: boolean;
    folders: SimpleFolderSearchFolderOption[];
    showFullFilePath: boolean;
}

export interface SimpleFolderSearchFolderOption {
    folderPath: string;
    recursive: boolean;
    excludeHiddenFiles: boolean;
}
