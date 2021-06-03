import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { defaultErrorIcon, defaultFileIcon } from "../../../common/icon/default-icons";
import { MdFindOptions } from "../../../common/config/mdfind-options";
import { OpenLocationPlugin } from "../../open-location-plugin";
import { Icon } from "../../../common/icon/icon";

export class MdFindPlugin implements ExecutionPlugin, OpenLocationPlugin {
    public readonly pluginType = PluginType.MdFindExecutionPlugin;
    private searchDelay: NodeJS.Timeout | number | undefined;

    constructor(
        private config: MdFindOptions,
        private readonly filePathExecutor: (filePath: string, privileged: boolean) => Promise<void>,
        private readonly filePathLocationExecutor: (filePath: string) => Promise<void>,
        private readonly mdfindSearcher: (
            searchTerm: string,
            mdfindOptions: MdFindOptions,
            pluginType: PluginType,
            defaultIcon: Icon,
        ) => Promise<SearchResultItem[]>,
    ) {}

    public isValidUserInput(userInput: string): boolean {
        return userInput.startsWith(this.config.prefix) && userInput.replace(this.config.prefix, "").length > 0;
    }

    public getSearchResults(userInput: string): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            if (this.searchDelay !== undefined) {
                clearTimeout(this.searchDelay as number);
            }

            this.searchDelay = setTimeout(() => {
                const searchTerm = userInput.replace(this.config.prefix, "");
                this.mdfindSearcher(searchTerm, this.config, this.pluginType, defaultFileIcon)
                    .then((result) => {
                        if (result.length > 0) {
                            resolve(result);
                        } else {
                            resolve([this.getErrorResult("No search results found")]);
                        }
                    })
                    .catch((err) => reject(err));
            }, this.config.debounceDelay);
        });
    }

    public isEnabled(): boolean {
        return this.config.enabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            this.filePathExecutor(searchResultItem.executionArgument, privileged)
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    public openLocation(searchResultItem: SearchResultItem): Promise<void> {
        return new Promise((resolve, reject) => {
            this.filePathLocationExecutor(searchResultItem.executionArgument)
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    public updateConfig(updatedConfig: UserConfigOptions): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.mdfindOptions;
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
