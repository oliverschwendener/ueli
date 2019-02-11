import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { PluginType } from "../../plugin-type";
import { ExecutionPlugin } from "../../execution-plugin";
import { IconType } from "../../../common/icon/icon-type";
import { Icon } from "../../../common/icon/icon";
import { EverythingSearcher } from "./everything-searcher";

export class EverythingExecutionPlugin implements ExecutionPlugin {
    public pluginType: PluginType = PluginType.EverythingSearchPlugin;
    private config: UserConfigOptions;
    private readonly filePathExecutor: (filePath: string, privileged: boolean) => Promise<void>;
    private readonly defaultIcon: Icon = {
        parameter: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
        <g id="surface1">
        <path style=" " d="M 6 3 L 6 29 L 26 29 L 26 9.59375 L 25.71875 9.28125 L 19.71875 3.28125 L 19.40625 3 Z M 8 5 L 18 5 L 18 11 L 24 11 L 24 27 L 8 27 Z M 20 6.4375 L 22.5625 9 L 20 9 Z "></path>
        </g>
        </svg>`,
        type: IconType.SVG,
    };

    constructor(config: UserConfigOptions, filePathExecutor: (filePath: string, privileged: boolean) => Promise<void>) {
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
            EverythingSearcher.search(userInput, this.config.everythingSearchOptions, this.defaultIcon, this.pluginType)
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

    public updateConfig(updatedUserConfig: UserConfigOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            this.config = updatedUserConfig;
            resolve();
        });
    }
}
