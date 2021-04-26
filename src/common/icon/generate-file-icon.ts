import { FileHelpers } from "../helpers/file-helpers";
import { app } from "electron";
import { Icon } from "./icon";
import { IconType } from "./icon-type";

export interface FileIconDataResult {
    filePath: string;
    icon: Icon;
}

export function getFileIconDataUrl(
    filePath: string,
    defaultFileIcon: Icon,
    folderIcon?: Icon,
): Promise<FileIconDataResult> {
    const defaultResult = {
        filePath,
        icon: defaultFileIcon,
    };

    return new Promise((resolve, reject) => {
        FileHelpers.fileExists(filePath)
            .then((fileExistsResult) => {
                if (fileExistsResult.fileExists) {
                    app.getFileIcon(filePath)
                        .then((icon) => {
                            FileHelpers.getStats(filePath)
                                .then((stats) => {
                                    const isDirectory = stats.stats.isDirectory() && !filePath.endsWith(".app");
                                    resolve({
                                        filePath,
                                        icon:
                                            isDirectory && folderIcon
                                                ? folderIcon
                                                : { parameter: icon.toDataURL(), type: IconType.URL },
                                    });
                                })
                                .catch(() => resolve(defaultResult));
                        })
                        .catch(() => resolve(defaultResult));
                } else {
                    resolve({
                        filePath,
                        icon: defaultFileIcon,
                    });
                }
            })
            .catch((err) => reject(err));
    });
}
