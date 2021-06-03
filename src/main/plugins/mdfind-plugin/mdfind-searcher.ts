import { SearchResultItem } from "../../../common/search-result-item";
import { exec } from "child_process";
import { normalize, basename } from "path";
import { getFileIconDataUrl } from "../../../common/icon/generate-file-icon";
import { MdFindOptions } from "../../../common/config/mdfind-options";
import { PluginType } from "../../plugin-type";
import { Icon } from "../../../common/icon/icon";
import { defaultFolderIcon } from "../../../common/icon/default-icons";

export function mdfindSearcher(
    searchTerm: string,
    mdfindOptions: MdFindOptions,
    pluginType: PluginType,
    defaultIcon: Icon,
): Promise<SearchResultItem[]> {
    return new Promise((resolve, reject) => {
        exec(
            `mdfind -name ${searchTerm} | head -n ${mdfindOptions.maxSearchResults}`,
            (mdfindError, stdout, stderr) => {
                if (mdfindError) {
                    reject(mdfindError);
                } else if (stderr) {
                    reject(stderr);
                } else {
                    const filePaths = stdout
                        .split("\n")
                        .map((f) => normalize(f).trim())
                        .filter((f) => f !== ".");

                    handleFilePaths(filePaths, pluginType, defaultIcon)
                        .then((result) => resolve(result))
                        .catch((err) => reject(err));
                }
            },
        );
    });
}

function handleFilePaths(filePaths: string[], pluginType: PluginType, defaultIcon: Icon): Promise<SearchResultItem[]> {
    return new Promise((resolve, reject) => {
        if (filePaths.length === 0) {
            resolve([]);
        }

        Promise.all(filePaths.map((f) => getFileIconDataUrl(f, defaultIcon, defaultFolderIcon)))
            .then((icons) => {
                const results = icons.map(
                    (icon): SearchResultItem => {
                        return {
                            description: icon.filePath,
                            executionArgument: icon.filePath,
                            hideMainWindowAfterExecution: true,
                            icon: icon.icon,
                            name: basename(icon.filePath),
                            originPluginType: pluginType,
                            searchable: [],
                            supportsOpenLocation: true,
                        };
                    },
                );
                resolve(results);
            })
            .catch((iconError) => reject(iconError));
    });
}
