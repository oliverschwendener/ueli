export type FolderSetting = {
    path: string;
    recursive: boolean;
};

export type Settings = {
    folders: FolderSetting[];
};
