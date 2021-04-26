import { SearchPlugin } from "../../search-plugin";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { PluginType } from "../../plugin-type";
import { UwpApplication } from "./uwp-application";
import { UwpSearchOptions } from "../../../common/config/uwp-search-options";

export class UwpPlugin implements SearchPlugin {
    public pluginType = PluginType.Uwp;
    private config: UwpSearchOptions;
    private uwpApps: UwpApplication[];
    private readonly filePathExecutor: (executionArgument: string, privileged: boolean) => Promise<void>;
    private readonly uwpAppsRetriever: (alreadyKnownApps: UwpApplication[]) => Promise<UwpApplication[]>;

    constructor(
        config: UwpSearchOptions,
        filePathExecutor: (executionArgument: string, privileged: boolean) => Promise<void>,
        uwpAppsRetriever: (alreadyKnownApps: UwpApplication[]) => Promise<UwpApplication[]>,
    ) {
        this.config = config;
        this.filePathExecutor = filePathExecutor;
        this.uwpAppsRetriever = uwpAppsRetriever;
        this.uwpApps = [];
    }

    public getAll(): Promise<SearchResultItem[]> {
        return new Promise((resolve) => resolve(this.createSearchResults(this.uwpApps)));
    }

    public refreshIndex(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.uwpAppsRetriever(this.uwpApps)
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
        return this.filePathExecutor(searchResultItem.executionArgument, privileged);
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.uwpSearchOptions;
            resolve();
        });
    }

    private createSearchResults(uwpApps: UwpApplication[]): SearchResultItem[] {
        return uwpApps.map((uwpApp) => ({
            description: "UWP App",
            executionArgument: `shell:AppsFolder\\${uwpApp.appId}`,
            hideMainWindowAfterExecution: true,
            icon: uwpApp.icon,
            name: uwpApp.name,
            needsUserConfirmationBeforeExecution: false,
            originPluginType: this.pluginType,
            searchable: [uwpApp.name],
        }));
    }
}
