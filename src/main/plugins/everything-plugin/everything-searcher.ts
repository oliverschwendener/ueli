import { SearchResultItem } from "../../../common/search-result-item";
import { exec } from "child_process";
import { normalize, basename } from "path";
import { getFileIconDataUrl } from "../../../common/icon/generate-file-icon";
import { EverythingSearchOptions } from "../../../common/config/everything-search-options";
import { Icon } from "../../../common/icon/icon";
import { PluginType } from "../../plugin-type";

export function everythingSearcher(
    userInput: string,
    everythingSearchOptions: EverythingSearchOptions,
    defaultFileIcon: Icon,
    defaultFolderIcon: Icon,
    pluginType: PluginType,
): Promise<SearchResultItem[]> {
    return new Promise((resolve, reject) => {
        const searchTerm = userInput.replace(everythingSearchOptions.prefix, "").trim();
        const utf8Encoding = "cmd /c chcp 65001>nul &&";
        const command = `${utf8Encoding} "${everythingSearchOptions.pathToEs}" -max-results ${everythingSearchOptions.maxSearchResults} ${searchTerm}`;
        exec(command, (everythingError, stdout, stderr) => {
            if (everythingError) {
                reject(everythingError);
            } else if (stderr) {
                reject(stderr);
            } else {
                const filePaths = stdout
                    .trim()
                    .split("\n")
                    .map((line) => normalize(line).trim())
                    .filter((f) => f !== ".");

                if (filePaths.length === 0) {
                    resolve([]);
                }

                const iconPromises = filePaths.map((filePath) =>
                    getFileIconDataUrl(filePath, defaultFileIcon, defaultFolderIcon),
                );
                Promise.all(iconPromises)
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
                    .catch((err) => reject(err));
            }
        });
    });
}
