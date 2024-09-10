export type FolderSetting = {
    path: string;
    recursive: boolean;
    searchFor: "files" | "folders" | "filesAndFolders";
};
