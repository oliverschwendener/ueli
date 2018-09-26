import { SearchResultItem } from "../search-result-item";
import { SearchPlugin } from "./search-plugin";
import { IconSet } from "../icon-sets/icon-set";
import { WindowsSetting } from "../operating-system-settings/windows/windows-setting";
import * as windowsSettings from "../operating-system-settings/windows/windows-settings";

export class Windows10SettingsSearchPlugin implements SearchPlugin {
    private iconSet: IconSet;
    private settings: WindowsSetting[];

    constructor(iconSet: IconSet) {
        this.iconSet = iconSet;
        this.settings = [];

        this.settings = this.settings
            .concat(windowsSettings.windows10Apps)
            .concat(windowsSettings.windowsAccountSettings)
            .concat(windowsSettings.windowsAppSettings)
            .concat(windowsSettings.windowsCortanaSettings)
            .concat(windowsSettings.windowsDeviceSettings)
            .concat(windowsSettings.windowsEaseOfAccessSettings)
            .concat(windowsSettings.windowsGeneralSettings)
            .concat(windowsSettings.windowsGetGamingSettings)
            .concat(windowsSettings.windowsNetworkSettings)
            .concat(windowsSettings.windowsPersonalizationSettings)
            .concat(windowsSettings.windowsPrivacySettings)
            .concat(windowsSettings.windowsTimeAndLanguageSettings)
            .concat(windowsSettings.windowsUpdateAndSecuritySettings);
    }

    public getAllItems(): SearchResultItem[] {
        return this.settings.map((setting: WindowsSetting): SearchResultItem => {
            return {
                description: setting.name,
                executionArgument: setting.executionArgument,
                icon: this.iconSet.operatingSystemSettingsIcon,
                name: setting.name,
                searchable: setting.tags,
                tags: setting.tags,
            };
        });
    }
}
