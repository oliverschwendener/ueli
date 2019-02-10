import { FileHelpers } from "../../main/helpers/file-helpers";
import { app } from "electron";
import { Icon } from "./icon";
import { IconType } from "./icon-type";

export interface FileIconDataResult {
    filePath: string;
    icon: Icon;
}

export function getFileIconDataUrl(filePath: string, defaultIcon: Icon): Promise<FileIconDataResult> {
    return new Promise((resolve) => {
        FileHelpers.fileExists(filePath)
            .then((fileExists) => {
                if (fileExists) {
                    app.getFileIcon(filePath, (err, icon) => {
                        if (err) {
                            resolve({
                                filePath,
                                icon: defaultIcon,
                            });
                        } else {
                            resolve({
                                filePath,
                                icon: {
                                    parameter: icon.toDataURL(),
                                    type: IconType.URL,
                                },
                            });
                        }
                    });
                } else {
                    resolve({
                        filePath,
                        icon: defaultIcon,
                    });
                }
            });
    });
}
