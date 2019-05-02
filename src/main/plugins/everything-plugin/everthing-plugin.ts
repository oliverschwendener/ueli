
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
            && userInput.replace(this.config.prefix, "").length > 0;
    }

    public getSearchResults(userInput: string): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            EverythingSearcher.search(userInput, this.config, defaultFileIcon, defaultFolderIcon, this.pluginType)
                .then((result) => resolve(result))
                .catch((err) => reject(err));
        });
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

    public updateConfig(updatedUserConfig: UserConfigOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            this.config = updatedUserConfig.everythingSearchOptions;
            resolve();
        });
    }
}
