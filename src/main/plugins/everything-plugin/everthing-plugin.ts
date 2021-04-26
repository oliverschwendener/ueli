import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { PluginType } from "../../plugin-type";
import { ExecutionPlugin } from "../../execution-plugin";
import { EverythingSearchOptions } from "../../../common/config/everything-search-options";
import { defaultFileIcon, defaultFolderIcon } from "../../../common/icon/default-icons";
import { OpenLocationPlugin } from "../../open-location-plugin";
import { Icon } from "../../../common/icon/icon";

export class EverythingPlugin implements ExecutionPlugin, OpenLocationPlugin {
    public pluginType: PluginType = PluginType.EverythingSearchPlugin;

    constructor(
        private config: EverythingSearchOptions,
        private readonly filePathExecutor: (filePath: string, privileged: boolean) => Promise<void>,
        private readonly filePathLocationExecutor: (filePath: string) => Promise<void>,
        private readonly everythingSearcher: (
            userInput: string,
            everythingSearchOptions: EverythingSearchOptions,
            defaultFileIcon: Icon,
            defaultFolderIcon: Icon,
            pluginType: PluginType,
        ) => Promise<SearchResultItem[]>,
    ) {}

    public isEnabled(): boolean {
        return this.config.enabled;
    }

    public isValidUserInput(userInput: string): boolean {
        return userInput.startsWith(this.config.prefix) && userInput.replace(this.config.prefix, "").length > 0;
    }

    public getSearchResults(userInput: string): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            this.everythingSearcher(userInput, this.config, defaultFileIcon, defaultFolderIcon, this.pluginType)
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

    public updateConfig(updatedUserConfig: UserConfigOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            this.config = updatedUserConfig.everythingSearchOptions;
            resolve();
        });
    }
}
