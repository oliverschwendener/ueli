import { SearchPlugin } from "../../search-plugin";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { PluginType } from "../../plugin-type";
import { UwpApplication } from "./uwp-application";
import { UwpSearchOptions } from "../../../common/config/uwp-search-options";
import { UwpAppRepository } from "./uwp-app-repository";

export class UwpPlugin implements SearchPlugin {
    public pluginType = PluginType.Uwp;
    private config: UwpSearchOptions;
    private readonly uwpAppRepository: UwpAppRepository;
    private readonly filePathExecutor: (executionArgument: string, privileged: boolean) => Promise<void>;

    constructor(
        config: UwpSearchOptions,
        uwpAppRepository: UwpAppRepository,
        filePathExecutor: (executionArgument: string, privileged: boolean) => Promise<void>,
        ) {
        this.config = config;
        this.uwpAppRepository = uwpAppRepository;
        this.filePathExecutor = filePathExecutor;
    }

    public getAll(): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            this.uwpAppRepository.getAll()
                .then((uwpApps) => {
                    resolve(uwpApps.map((uwpApp) => this.createSearchResult(uwpApp)));
                })
                .catch((err) => reject(err));
        });
    }
    public refreshIndex(): Promise<void> {
        return new Promise((resolve) => resolve());
    }
    public clearCache(): Promise<void> {
        return new Promise((resolve) => resolve());
    }
    public isEnabled(): boolean {
        return this.config.isEnabled;
    }
    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return this.filePathExecutor(searchResultItem.executionArgument, false);
    }
    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.uwpSearchOptions;
            resolve();
        });
    }

    private createSearchResult(uwpApp: UwpApplication): SearchResultItem {
        return {
            description: "UWP App",
            executionArgument: uwpApp.executionArgument,
            hideMainWindowAfterExecution: true,
            icon: uwpApp.icon,
            name: uwpApp.name,
            needsUserConfirmationBeforeExecution: false,
            originPluginType: this.pluginType,
            searchable: [uwpApp.name],
        };
    }
}
