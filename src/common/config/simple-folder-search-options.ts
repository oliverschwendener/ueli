export interface SimpleFolderSearchOptions {
    isEnabled: boolean;
    folders: SimpleFolderSearchFolderOption[];
}

interface SimpleFolderSearchFolderOption {
    folderPath: string;
    recursive: boolean;
    excludeHiddenFiles: boolean;
}
