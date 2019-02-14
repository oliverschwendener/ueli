import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { Icon } from "../../../common/icon/icon";
import { IconType } from "../../../common/icon/icon-type";
import { MdFindSearcher } from "./mdfind-searcher";
import { defaultErrorIcon } from "../../../common/icon/default-error-icon";

export class MdFindExecutionPlugin implements ExecutionPlugin {
    public pluginType = PluginType.MdFindExecutionPlugin;
    private config: UserConfigOptions;
    private readonly filePathExecutor: (filePath: string, privileged: boolean) => Promise<void>;
    private searchDelay: NodeJS.Timeout | number;
    private readonly defaultIcon: Icon = {
        parameter: `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 40 40" style="enable-background:new 0 0 40 40;" xml:space="preserve">
        <g><polygon style="fill:#FFFFFF;" points="6.5,37.5 6.5,2.5 24.793,2.5 33.5,11.207 33.5,37.5 	"></polygon>
            <g>
                <path style="fill:#788B9C;" d="M24.586,3L33,11.414V37H7V3H24.586 M25,2H6v36h28V11L25,2L25,2z"></path>
            </g>
        </g>
        <g>
            <polygon style="fill:#FFFFFF;" points="24.5,11.5 24.5,2.5 24.793,2.5 33.5,11.207 33.5,11.5 	"></polygon>
            <g>
                <path style="fill:#788B9C;" d="M25,3.414L32.586,11H25V3.414 M25,2h-1v10h10v-1L25,2L25,2z"></path>
            </g>
        </g>
        </svg>`,
        type: IconType.SVG,
    };

    constructor(config: UserConfigOptions, filePathExecutor: (filePath: string, privileged: boolean) => Promise<void>) {
        this.config = config;
        this.filePathExecutor = filePathExecutor;
    }

    public isValidUserInput(userInput: string): boolean {
        return userInput.startsWith(this.config.mdfindOptions.prefix)
            && userInput.replace(this.config.mdfindOptions.prefix, "").length > 0;
    }

    public getSearchResults(userInput: string): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            if (this.searchDelay !== undefined) {
                clearTimeout(this.searchDelay as number);
            }

            this.searchDelay = setTimeout(() => {
                const searchTerm = userInput.replace(this.config.mdfindOptions.prefix, "");
                MdFindSearcher.search(searchTerm, this.config.mdfindOptions, this.pluginType, this.defaultIcon)
                    .then((result) => {
                        if (result.length > 0) {
                            resolve(result);
                        } else {
                            resolve([this.getErrorResult("No search results found")]);
                        }
                    })
                    .catch((err) => reject(err));
            }, this.config.mdfindOptions.debounceDelay);
        });
    }

    public isEnabled(): boolean {
        return this.config.mdfindOptions.enabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            this.filePathExecutor(searchResultItem.executionArgument, privileged)
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    public updateConfig(updatedConfig: UserConfigOptions): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig;
            resolve();
        });
    }

    private getErrorResult(errorMessage: string, details?: string): SearchResultItem {
        return {
            description: details ? details : "",
            executionArgument: "",
            hideMainWindowAfterExecution: false,
            icon: defaultErrorIcon,
            name: errorMessage,
            originPluginType: PluginType.None,
            searchable: [],
        };
    }
}
