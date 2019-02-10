import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { PluginType } from "../../plugin-type";
import { ExecutionPlugin } from "../../execution-plugin";
import { exec } from "child_process";
import { normalize, basename } from "path";
import { IconType } from "../../../common/icon/icon-type";
import { getFileIconDataUrl } from "../../../common/icon/generate-file-icon";
import { Icon } from "../../../common/icon/icon";

export class EverythingSearchPlugin implements ExecutionPlugin {
    public pluginType: PluginType = PluginType.EverythingSearchPlugin;
    private config: UserConfigOptions;
    private filePathExecutor: (filePath: string) => Promise<void>;
    private defaultIcon: Icon = {
        parameter: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
        <g id="surface1">
        <path style=" " d="M 6 3 L 6 29 L 26 29 L 26 9.59375 L 25.71875 9.28125 L 19.71875 3.28125 L 19.40625 3 Z M 8 5 L 18 5 L 18 11 L 24 11 L 24 27 L 8 27 Z M 20 6.4375 L 22.5625 9 L 20 9 Z "></path>
        </g>
        </svg>`,
        type: IconType.SVG,
    };

    constructor(config: UserConfigOptions, filePathExecutor: (filePath: string) => Promise<void>) {
        this.config = config;
        this.filePathExecutor = filePathExecutor;
    }

    public isEnabled(): boolean {
        return this.config.everythingSearchOptions.enabled;
    }

    public isValidUserInput(userInput: string): boolean {
        return userInput.startsWith(this.config.everythingSearchOptions.prefix)
            && userInput.replace(this.config.everythingSearchOptions.prefix, "").length > 0;
    }

    public getSearchResults(userInput: string): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            const searchTerm = userInput.replace(this.config.everythingSearchOptions.prefix, "").trim();
            const command = `${this.config.everythingSearchOptions.pathToEs} -max-results ${this.config.everythingSearchOptions.maxSearchResults} ${searchTerm}`;
            exec(command, (everythingError, stdout) => {
                if (everythingError) {
                    reject(everythingError);
                } else {
                    const filePaths =  stdout.trim()
                        .split("\n")
                        .map((line) => normalize(line)
                        .trim()).filter((f) => f !== ".");

                    if (filePaths.length === 0) {
                        resolve([]);
                    }

                    const iconPromises = filePaths.map((filePath) => getFileIconDataUrl(filePath, this.defaultIcon));
                    Promise.all(iconPromises)
                        .then((icons) => {
                            const results: SearchResultItem[] = [];

                            icons.forEach((icon) => {
                                results.push({
                                    description: icon.filePath,
                                    executionArgument: icon.filePath,
                                    hideMainWindowAfterExecution: true,
                                    icon: icon.icon,
                                    name: basename(icon.filePath),
                                    originPluginType: this.pluginType,
                                    searchable: [],
                                });
                            });

                            resolve(results);
                        })
                        .catch((err) => reject(err));
                }
            });
        });
    }

    public execute(searchResultItem: SearchResultItem): Promise<void> {
        return new Promise((resolve, reject) => {
            this.filePathExecutor(searchResultItem.executionArgument)
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    public updateConfig(updatedUserConfig: UserConfigOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            this.config = updatedUserConfig;
            resolve();
        });
    }
}
