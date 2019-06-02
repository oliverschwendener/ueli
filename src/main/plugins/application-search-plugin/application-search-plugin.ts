import { SearchPlugin } from "../../search-plugin";
import { SearchResultItem } from "../../../common/search-result-item";
import { ApplicationRepository } from "./application-repository";
import { PluginType } from "../../plugin-type";
import { Application } from "./application";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { ApplicationSearchOptions } from "./application-search-options";
import { IconType } from "../../../common/icon/icon-type";
import { AutoCompletionResult } from "../../../common/auto-completion-result";
import { createFilePathDescription } from "../../helpers/file-path-helpers";

export class ApplicationSearchPlugin implements SearchPlugin {
    public readonly pluginType = PluginType.ApplicationSearchPlugin;
    public readonly openLocationSupported = true;
    public readonly autoCompletionSupported = false;
    private config: ApplicationSearchOptions;
    private readonly applicationRepository: ApplicationRepository;
    private readonly executeApplication: (executionArgument: string, privileged?: boolean) => Promise<void>;
    private readonly openApplicationLocation: (filePath: string) => Promise<void>;

    constructor(config: ApplicationSearchOptions,
                applicationRepository: ApplicationRepository,
                executeApplication: (executionArgument: string, privileged: boolean) => Promise<void>,
                openApplicationLocation: (filePath: string) => Promise<void>) {
        this.config = config;
        this.applicationRepository = applicationRepository;
        this.executeApplication = executeApplication;
        this.openApplicationLocation = openApplicationLocation;
    }

    public async getAll(): Promise<SearchResultItem[]> {
        if (!this.isEnabled()) { return []; }
        try {
            const applications = await this.applicationRepository.getAll();
            const searchResultItemPromises = applications.map((application) => this.createSearchResultItemFromApplication(application));
            const searchResultItems =  await Promise.all(searchResultItemPromises);
            return searchResultItems;
        } catch (error) {
            return error;
        }
    }

    public async execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        try {
            await this.executeApplication(searchResultItem.executionArgument, privileged);
        } catch (error) {
            return error;
        }
    }

    public async openLocation(searchResultItem: SearchResultItem): Promise<void> {
        try {
            await this.openApplicationLocation(searchResultItem.executionArgument);
        } catch (error) {
            return error;
        }
    }

    public async autoComplete(searchResultItem: SearchResultItem): Promise<AutoCompletionResult> {
        throw Error("Autocompletion not supported");
    }

    public async refreshIndex(): Promise<void> {
        if (!this.isEnabled()) { return; }
        try {
            await this.applicationRepository.refreshIndex();
        } catch (error) {
            return error;
        }
    }

    public async clearCache(): Promise<void> {
        try {
            await this.applicationRepository.clearCache();
        } catch (error) {
            return error;
        }
    }

    public async updateConfig(config: UserConfigOptions): Promise<void> {
        try {
            this.config = config.applicationSearchOptions;
            await this.applicationRepository.updateConfig(config.applicationSearchOptions);
        } catch (error) {
            return error;
        }
    }

    public isEnabled(): boolean {
        return this.config.enabled;
    }

    private async createSearchResultItemFromApplication(application: Application): Promise<SearchResultItem> {
        return {
            description: createFilePathDescription(application.filePath),
            executionArgument: application.filePath,
            hideMainWindowAfterExecution: true,
            icon: {
                parameter: application.icon,
                type: IconType.URL,
            },
            name: application.name,
            originPluginType: this.pluginType,
            searchable: [application.name],
        };
    }
}
