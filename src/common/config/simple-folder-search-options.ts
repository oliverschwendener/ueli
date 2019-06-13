export interface SimpleFolderSearchOptions {
    isEnabled: boolean;
    folders: SimpleFolderSearchFolderOption[];
}

export interface SimpleFolderSearchFolderOption {
    folderPath: string;
    recursive: boolean;
    excludeHiddenFiles: boolean;
}
