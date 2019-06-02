import { SearchPlugin } from "../../search-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { AutoCompletionResult } from "../../../common/auto-completion-result";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { OperatingSystemSettingsOptions } from "../../../common/config/operating-system-settings-options";
import { OperatingSystemSettingRepository } from "./operating-system-setting-repository";

export class OperatingSystemSettingsPlugin implements SearchPlugin {
    public readonly pluginType = PluginType.OperatingSystemSettingsPlugin;
    public readonly openLocationSupported = false;
    public readonly autoCompletionSupported = false;
    private config: OperatingSystemSettingsOptions;
    private translationSet: TranslationSet;
    private readonly operatingSystemSettingRepository: OperatingSystemSettingRepository;
    private readonly operatingSystemSettingExecutor: (executionArgument: string) => Promise<void>;

    constructor(
        config: OperatingSystemSettingsOptions,
        translationSet: TranslationSet,
        operatingSystemSettingRepository: OperatingSystemSettingRepository,
        operatingSystemSettingExecutor: (executionArgument: string) => Promise<void>) {
        this.config = config;
        this.translationSet = translationSet;
        this.operatingSystemSettingRepository = operatingSystemSettingRepository;
        this.operatingSystemSettingExecutor = operatingSystemSettingExecutor;
    }

    public async getAll(): Promise<SearchResultItem[]> {
        try {
            const operatingSystemSettings = await this.operatingSystemSettingRepository.getAll(this.translationSet);
            const result = operatingSystemSettings.map((operatingSystemSetting): SearchResultItem => {
                return {
                    description: operatingSystemSetting.description,
                    executionArgument: operatingSystemSetting.executionArgument,
                    hideMainWindowAfterExecution: true,
                    icon: operatingSystemSetting.icon,
                    name: operatingSystemSetting.name,
                    originPluginType: this.pluginType,
                    searchable: operatingSystemSetting.tags.concat([operatingSystemSetting.name]),
                };
            });
            return result;
        } catch (error) {
            return error;
        }
    }

    public async refreshIndex(): Promise<void> {} // tslint:disable-line

    public async clearCache(): Promise<void> {} // tslint:disable-line

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return this.operatingSystemSettingExecutor(searchResultItem.executionArgument);
    }

    public openLocation(searchResultItem: SearchResultItem): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public autoComplete(searchResultItem: SearchResultItem): Promise<AutoCompletionResult> {
        throw new Error("Method not implemented.");
    }

    public async updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        this.config = updatedConfig.operatingSystemSettingsOptions;
        this.translationSet = translationSet;
    }
}
