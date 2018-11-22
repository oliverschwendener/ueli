import { SearchResultItem } from "../search-result-item";
import { SearchPlugin } from "./search-plugin";
import { IconSet } from "../icon-sets/icon-set";
import { WindowsSetting } from "../operating-system-settings/windows/windows-setting";
import { UeliHelpers } from "../helpers/ueli-helpers";
import { Windows10App } from "../operating-system-settings/windows/windows-10-app";

export class Windows10SettingsSearchPlugin implements SearchPlugin {
    private readonly iconSet: IconSet;
    private readonly settings: WindowsSetting[];
    private readonly apps: Windows10App[];

    constructor(settings: WindowsSetting[], apps: Windows10App[], iconSet: IconSet) {
        this.iconSet = iconSet;
        this.settings = settings;
        this.apps = apps;
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
