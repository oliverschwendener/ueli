import { SearchPlugin } from "../../search-plugin";
import { SearchResultItem } from "../../../common/search-result-item";
import { ApplicationRepository } from "./application-repository";
import { PluginType } from "../../plugin-type";
import { Application } from "./application";
import { dirname, basename } from "path";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { ApplicationSearchOptions } from "./application-search-options";
import { IconType } from "../../../common/icon/icon-type";

export class ApplicationSearchPlugin implements SearchPlugin {
    public readonly pluginType = PluginType.ApplicationSearchPlugin;
    private config: ApplicationSearchOptions;
    private readonly applicationRepository: ApplicationRepository;
    private readonly executeApplication: (executionArgument: string) => Promise<void>;

    constructor(config: ApplicationSearchOptions, applicationRepository: ApplicationRepository, executeApplication: (executionArgument: string) => Promise<void>) {
        this.config = config;
        this.applicationRepository = applicationRepository;
        this.executeApplication = executeApplication;
    }

    public getAll(): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            if (!this.isEnabled()) {
                resolve();
            } else {
                this.applicationRepository.getAll()
                .then((applications) => {
                    const searchResultItemPromises = applications.map((application) => this.createSearchResultItemFromApplication(application));
                    Promise.all(searchResultItemPromises)
                        .then((searchResultItems) => resolve(searchResultItems))
                        .catch((err) => reject(err));
                })
                .catch((err) => reject(err));
            }
        });
    }

    public execute(searchResultItem: SearchResultItem): Promise<void> {
        return new Promise((resolve, reject) => {
            this.executeApplication(searchResultItem.executionArgument)
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    public refreshIndex(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.isEnabled()) {
                resolve();
            } else {
                this.applicationRepository.refreshIndex()
                    .then(() => resolve())
                    .catch((err) => reject(err));
            }
        });
    }

    public clearCache(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.applicationRepository.clearCache()
                .then(() => resolve())
                .catch((err) => reject(`Error while trying to clear application repository cache: ${err}`));
        });
    }

    public updateConfig(config: UserConfigOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            this.config = config.applicationSearchOptions;
            this.applicationRepository.updateConfig(config.applicationSearchOptions)
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    public isEnabled(): boolean {
        return this.config.enabled;
    }

    private createSearchResultItemFromApplication(application: Application): Promise<SearchResultItem> {
        return new Promise((resolve) => {
            resolve({
                description: this.createApplicationDescription(application),
                executionArgument: application.filePath,
                hideMainWindowAfterExecution: true,
                icon: {
                    parameter: application.icon,
                    type: IconType.URL,
                },
                name: application.name,
                originPluginType: this.pluginType,
                searchable: [application.name],
            });
        });
    }

    private createApplicationDescription(application: Application): string {
        return `${basename(dirname(application.filePath))} ▸ ${basename(application.filePath)}`;
    }
}
