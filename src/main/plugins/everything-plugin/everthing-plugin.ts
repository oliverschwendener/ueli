
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { PluginType } from "../../plugin-type";
import { ExecutionPlugin } from "../../execution-plugin";
import { EverythingSearcher } from "./everything-searcher";
import { AutoCompletionResult } from "../../../common/auto-completion-result";
import { EverythingSearchOptions } from "../../../common/config/everything-search-options";
import { defaultFileIcon, defaultFolderIcon } from "../../../common/icon/default-icons";

export class EverythingPlugin implements ExecutionPlugin {
    public pluginType: PluginType = PluginType.EverythingSearchPlugin;
    public readonly openLocationSupported = true;
    public readonly autoCompletionSupported = false;
    private config: EverythingSearchOptions;
    private readonly filePathExecutor: (filePath: string, privileged: boolean) => Promise<void>;
    private readonly filePathLocationExecutor: (filePath: string) => Promise<void>;

    constructor(
        config: EverythingSearchOptions,
        filePathExecutor: (filePath: string, privileged: boolean) => Promise<void>,
        filePathLocationExecutor: (filePath: string) => Promise<void>,
        ) {
        this.config = config;
        this.filePathExecutor = filePathExecutor;
        this.filePathLocationExecutor = filePathLocationExecutor;
    }

    public isEnabled(): boolean {
        return this.config.enabled;
    }

    public isValidUserInput(userInput: string): boolean {
        return userInput.startsWith(this.config.prefix)
            && userInput.replace(this.config.prefix, "").trim().length > 0;
    }

    public async getSearchResults(userInput: string): Promise<SearchResultItem[]> {
        try {
            const result = await EverythingSearcher.search(userInput, this.config, defaultFileIcon, defaultFolderIcon, this.pluginType);
            return result;
        } catch (error) {
            return error;
        }
    }

    public async execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        try {
            await this.filePathExecutor(searchResultItem.executionArgument, privileged);
        } catch (error) {
            return error;
        }
    }

    public async openLocation(searchResultItem: SearchResultItem): Promise<void> {
        try {
            await this.filePathLocationExecutor(searchResultItem.executionArgument);
        } catch (error) {
            return error;
        }
    }

    public async autoComplete(searchResultItem: SearchResultItem): Promise<AutoCompletionResult> {
        throw Error("Autocompletion not supported");
    }

    public async updateConfig(updatedUserConfig: UserConfigOptions): Promise<void> {
        this.config = updatedUserConfig.everythingSearchOptions;
    }
}
