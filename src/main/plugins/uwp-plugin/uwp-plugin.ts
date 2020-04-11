import { SearchPlugin } from "../../search-plugin";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { PluginType } from "../../plugin-type";
import { UwpApplication } from "./uwp-application";
import { UwpAppsRetriever } from "./uwp-apps-retriever";
import { UwpSearchOptions } from "../../../common/config/uwp-search-options";

export class UwpPlugin implements SearchPlugin {
    public pluginType = PluginType.Uwp;
    private config: UwpSearchOptions;
    private uwpApps: UwpApplication[];
    private readonly filePathExecutor: (executionArgument: string, privileged: boolean) => Promise<void>;

    constructor(
        config: UwpSearchOptions,
        filePathExecutor: (executionArgument: string, privileged: boolean) => Promise<void>,
    ) {
        this.config = config;
        this.filePathExecutor = filePathExecutor;
        this.uwpApps = [];
    }

    public getAll(): Promise<SearchResultItem[]> {
        return new Promise((resolve) => resolve(this.uwpApps.map((app) => this.createSearchResult(app))));
    }

    public refreshIndex(): Promise<void> {
        return new Promise((resolve, reject) => {
            UwpAppsRetriever.getAll(this.uwpApps)
                .then((apps) => {
                    this.uwpApps = apps;
                    resolve();
                })
                .catch((error) => reject(error));
        });
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
            executionArgument: `shell:AppsFolder\\${uwpApp.appId}`,
            hideMainWindowAfterExecution: true,
            icon: uwpApp.icon,
            name: uwpApp.name,
            needsUserConfirmationBeforeExecution: false,
            originPluginType: this.pluginType,
            searchable: [uwpApp.name],
        };
    }
}
