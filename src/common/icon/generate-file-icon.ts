import { FileHelpers } from "../../main/helpers/file-helpers";
import { app } from "electron";
import { Icon } from "./icon";
import { IconType } from "./icon-type";

export interface FileIconDataResult {
    filePath: string;
    icon: Icon;
}

export function getFileIconDataUrl(filePath: string, defaultFileIcon: Icon, folderIcon?: Icon): Promise<FileIconDataResult> {
    return new Promise((resolve) => {
        FileHelpers.fileExists(filePath)
            .then((fileExists) => {
                if (fileExists) {
                    app.getFileIcon(filePath, (err, icon) => {
                        const defaultResult = {
                            filePath,
                            icon: defaultFileIcon,
                        };
                        if (err) {
                            resolve(defaultResult);
                        } else {
                            FileHelpers.getStats(filePath)
                                .then((stats) => {
                                    resolve({
                                        filePath,
                                        icon: stats.stats.isDirectory() && folderIcon
                                            ? folderIcon
                                            : { parameter: icon.toDataURL(), type: IconType.URL },
                                    });
                                })
                                .catch(() => resolve(defaultResult));
                        }
                    });
                } else {
                    resolve({
                        filePath,
                        icon: defaultFileIcon,
                    });
                }
            });
    });
}
