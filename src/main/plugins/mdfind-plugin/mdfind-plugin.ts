import { ExecutionPlugin } from "../../execution-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { MdFindSearcher } from "./mdfind-searcher";
import { defaultErrorIcon, defaultFileIcon } from "../../../common/icon/default-icons";
import { AutoCompletionResult } from "../../../common/auto-completion-result";
import { MdFindOptions } from "../../../common/config/mdfind-options";

export class MdFindPlugin implements ExecutionPlugin {
    public readonly pluginType = PluginType.MdFindExecutionPlugin;
    public readonly openLocationSupported = true;
    public readonly autoCompletionSupported = false;
    private config: MdFindOptions;
    private readonly filePathExecutor: (filePath: string, privileged: boolean) => Promise<void>;
    private readonly filePathLocationExecutor: (filePath: string) => Promise<void>;
    private searchDelay: NodeJS.Timeout | number;

    constructor(
        config: MdFindOptions,
        filePathExecutor: (filePath: string, privileged: boolean) => Promise<void>,
        filePathLocationExecutor: (filePath: string) => Promise<void>,
        ) {
        this.config = config;
        this.filePathExecutor = filePathExecutor;
        this.filePathLocationExecutor = filePathLocationExecutor;
    }

    public isValidUserInput(userInput: string): boolean {
        return userInput.startsWith(this.config.prefix)
            && userInput.replace(this.config.prefix, "").trim().length > 0;
    }

    public getSearchResults(userInput: string): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            if (this.searchDelay !== undefined) {
                clearTimeout(this.searchDelay as number);
            }

            this.searchDelay = setTimeout(() => {
                const searchTerm = userInput.replace(this.config.prefix, "");
                MdFindSearcher.search(searchTerm, this.config, this.pluginType, defaultFileIcon)
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

    public async execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        try {
            await this.filePathExecutor(searchResultItem.executionArgument, privileged);
        } catch (error) {
            return error;
        }
    }

    public async openLocation(searchResultItem: SearchResultItem): Promise<void> {

        return new Promise((resolve, reject) => {
            this.filePathLocationExecutor(searchResultItem.executionArgument)
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    public async autoComplete(searchResultItem: SearchResultItem): Promise<AutoCompletionResult> {
        throw Error("Autocompletion not supported");
    }

    public async updateConfig(updatedConfig: UserConfigOptions): Promise<void> {
        this.config = updatedConfig.mdfindOptions;
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
