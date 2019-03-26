import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { MdFindSearcher } from "./mdfind-searcher";
import { defaultErrorIcon, defaultFileIcon } from "../../../common/icon/default-icons";
import { AutoCompletionResult } from "../../../common/auto-completion-result";

export class MdFindExecutionPlugin implements ExecutionPlugin {
    public readonly pluginType = PluginType.MdFindExecutionPlugin;
    public readonly openLocationSupported = true;
    public readonly autoCompletionSupported = false;
    private config: UserConfigOptions;
    private readonly filePathExecutor: (filePath: string, privileged: boolean) => Promise<void>;
    private readonly filePathLocationExecutor: (filePath: string) => Promise<void>;
    private searchDelay: NodeJS.Timeout | number;

    constructor(
        config: UserConfigOptions,
        filePathExecutor: (filePath: string, privileged: boolean) => Promise<void>,
        filePathLocationExecutor: (filePath: string) => Promise<void>,
        ) {
        this.config = config;
        this.filePathExecutor = filePathExecutor;
        this.filePathLocationExecutor = filePathLocationExecutor;
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
                MdFindSearcher.search(searchTerm, this.config.mdfindOptions, this.pluginType, defaultFileIcon)
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

    public openLocation(searchResultItem: SearchResultItem): Promise<void> {
        return new Promise((resolve, reject) => {
            this.filePathLocationExecutor(searchResultItem.executionArgument)
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    public autoComplete(searchResultItem: SearchResultItem): Promise<AutoCompletionResult> {
        return new Promise((resolve, reject) => {
            reject("Autocompletion not supported");
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
