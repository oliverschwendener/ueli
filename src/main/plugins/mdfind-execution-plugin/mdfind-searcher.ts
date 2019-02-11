import { SearchResultItem } from "../../../common/search-result-item";
import { exec } from "child_process";
import { normalize, basename } from "path";
import { getFileIconDataUrl } from "../../../common/icon/generate-file-icon";
import { MdFindOptions } from "../../../common/config/mdfind-options";
import { PluginType } from "../../plugin-type";
import { Icon } from "../../../common/icon/icon";

export class MdFindSearcher {
    public static search(searchTerm: string, mdfindOptions: MdFindOptions, pluginType: PluginType, defaultIcon: Icon): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            exec(`mdfind ${searchTerm} | head -n ${mdfindOptions.maxSearchResults}`, (mdfindError, stdout) => {
                if (mdfindError) {
                    reject(mdfindError);
                } else {
                    const filePaths = stdout
                        .split("\n")
                        .map((f) => normalize(f).trim())
                        .filter((f) => f !== ".");

                    if (filePaths.length === 0) {
                        resolve([]);
                    }

                    const iconPromises = filePaths.map((f) => getFileIconDataUrl(f, defaultIcon));
                    Promise.all(iconPromises)
                        .then((icons) => {
                            const results = icons.map((icon): SearchResultItem => {
                                return {
                                    description: icon.filePath,
                                    executionArgument: icon.filePath,
                                    hideMainWindowAfterExecution: true,
                                    icon: icon.icon,
                                    name: basename(icon.filePath),
                                    originPluginType: pluginType,
                                    searchable: [],
                                };
                            });
                            resolve(results);
                        })
                        .catch((iconError) => reject(iconError));
                }
            });
        });
    }
}
