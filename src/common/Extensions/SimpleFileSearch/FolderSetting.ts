export type FolderSetting = {
    id: string;
    path: string;
    recursive: boolean;
    searchFor: "files" | "folders" | "filesAndFolders";
};
