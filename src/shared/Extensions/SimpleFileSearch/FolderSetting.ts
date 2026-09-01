export type FolderSetting = {
    id: string;
    path: string;
    recursive: boolean;
    excludeHiddenFiles?: boolean;
    searchFor: "files" | "folders" | "filesAndFolders";
};
