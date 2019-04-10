import { SearchResultItem } from "../../../common/search-result-item";
import { exec } from "child_process";
import { normalize, basename } from "path";
import { getFileIconDataUrl } from "../../../common/icon/generate-file-icon";
import { EverythingSearchOptions } from "../../../common/config/everything-search-options";
import { Icon } from "../../../common/icon/icon";
import { PluginType } from "../../plugin-type";
import { IconType } from "../../../common/icon/icon-type";

export class EverythingSearcher {
    public static search(userInput: string, everythingSearchOptions: EverythingSearchOptions, defaultIcon: Icon, pluginType: PluginType): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            const folderIcon: Icon = {
                parameter: `
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 40 40" style="enable-background:new 0 0 40 40;" xml:space="preserve">
                <g>
                    <polygon style="fill:#DBB065;" points="1.5,35.5 1.5,4.5 11.793,4.5 14.793,7.5 38.5,7.5 38.5,35.5 	"></polygon>
                    <g>
                        <path style="fill:#967A44;" d="M11.586,5l2.707,2.707L14.586,8H15h23v27H2V5H11.586 M12,4H1v32h38V7H15L12,4L12,4z"></path>
                    </g>
                </g>
                <g>
                    <polygon style="fill:#F5CE85;" points="1.5,35.5 1.5,9.5 12.151,9.5 15.151,7.5 38.5,7.5 38.5,35.5 	"></polygon>
                    <g>
                        <path style="fill:#967A44;" d="M38,8v27H2V10h10h0.303l0.252-0.168L15.303,8H38 M39,7H15l-3,2H1v27h38V7L39,7z"></path>
                    </g>
                </g>
                </svg>
                `,
                type: IconType.SVG,
            };
            const searchTerm = userInput.replace(everythingSearchOptions.prefix, "").trim();
            const command = `${everythingSearchOptions.pathToEs} -max-results ${everythingSearchOptions.maxSearchResults} ${searchTerm}`;
            exec(command, (everythingError, stdout) => {
                if (everythingError) {
                    reject(everythingError);
                } else {
                    const filePaths =  stdout.trim()
                        .split("\n")
                        .map((line) => normalize(line).trim())
                        .filter((f) => f !== ".");

                    if (filePaths.length === 0) {
                        resolve([]);
                    }

                    const iconPromises = filePaths.map((filePath) => getFileIconDataUrl(filePath, defaultIcon, folderIcon));
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
                        .catch((err) => reject(err));
                }
            });
        });
    }
}
