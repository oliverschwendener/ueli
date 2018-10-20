import { SearchResultItem } from "../search-result-item";
import { SearchPlugin } from "./search-plugin";
import { IconSet } from "../icon-sets/icon-set";
import { WindowsSetting } from "../operating-system-settings/windows/windows-setting";
import { allWindowsSettings } from "../operating-system-settings/windows/windows-settings";
import { UeliHelpers } from "../helpers/ueli-helpers";
import { Windows10App } from "../operating-system-settings/windows/windows-10-app";
import { allWindows10Apps } from "../operating-system-settings/windows/windows-10-apps";

export class Windows10SettingsSearchPlugin implements SearchPlugin {
    private iconSet: IconSet;
    private settings: WindowsSetting[];
    private apps: Windows10App[];

    constructor(iconSet: IconSet) {
        this.iconSet = iconSet;
        this.settings = allWindowsSettings;
        this.apps = allWindows10Apps;
    }

    public getIndexLength(): number {
        return this.settings.length + this.apps.length;
    }

    public getAllItems(): SearchResultItem[] {
        return this.getAllWindowsSettings()
            .concat(this.getAllWindows10Apps());
    }

    private getAllWindowsSettings(): SearchResultItem[] {
        return this.settings.map((setting: WindowsSetting): SearchResultItem => {
            return {
                description: `Windows Settings ${UeliHelpers.searchResultDescriptionSeparator} ${setting.name}`,
                executionArgument: setting.executionArgument,
                icon: this.iconSet.operatingSystemSettingsIcon,
                name: setting.name,
                searchable: [setting.name].concat(setting.tags),
            };
        });
    }

    private getAllWindows10Apps(): SearchResultItem[] {
        return this.apps.map((app: Windows10App): SearchResultItem => {
            return {
                description: "Windows 10 UWP App",
                executionArgument: app.executionArgument,
                icon: app.icon,
                name: app.name,
                searchable: [app.name],
            };
        });
    }
}
