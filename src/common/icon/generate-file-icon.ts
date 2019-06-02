import {promises} from "fs";
const {access, lstat} = promises;

import { app } from "electron";
import { Icon } from "./icon";
import { IconType } from "./icon-type";

export interface FileIconDataResult {
    filePath: string;
    icon: Icon;
}

export async function getFileIconDataUrl(filePath: string, defaultFileIcon: Icon, folderIcon?: Icon): Promise<FileIconDataResult> {
    const fileExists = (await access(filePath)) === undefined;
    const defaultResult = {
        filePath,
        icon: defaultFileIcon,
    };

    if (fileExists) {
        try {
            const icon = (await app.getFileIcon(filePath)).toDataURL();
            const isDirectory = (await lstat(filePath)).isDirectory() && !filePath.endsWith(".app");
            return {
                filePath,
                icon: (isDirectory && folderIcon) ? folderIcon : {parameter: icon, type: IconType.URL},
            };
        } catch (error) {
            return defaultResult;
        }
    } else {
        return defaultResult;
    }
}
