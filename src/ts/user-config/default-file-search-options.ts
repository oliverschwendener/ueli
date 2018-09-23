import { homedir } from "os";

export const defaultFileSearchOptions = [
    {
        folderPath: homedir(),
        recursive: false,
    },
];
