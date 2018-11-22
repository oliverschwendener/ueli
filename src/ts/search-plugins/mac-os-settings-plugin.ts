import { SearchResultItem } from "../search-result-item";
import { SearchPlugin } from "./search-plugin";
import { IconSet } from "../icon-sets/icon-set";
import { MacOsSetting } from "../operating-system-settings/macos/mac-os-setting";
import { UeliHelpers } from "../helpers/ueli-helpers";
import { basename } from "path";

export class MacOsSettingsPlugin implements SearchPlugin {
    private readonly iconSet: IconSet;
    private readonly settings: MacOsSetting[];

    constructor(settings: MacOsSetting[], iconSet: IconSet) {
        this.iconSet = iconSet;
        this.settings = settings;
    }

    public getIndexLength(): number {
        return this.settings.length;
    }

    public getAllItems(): SearchResultItem[] {
        return this.settings.map((setting: MacOsSetting): SearchResultItem => {
            return {
                description: `System Preferences ${UeliHelpers.searchResultDescriptionSeparator} ${basename(setting.executionArgument)}`,
                executionArgument: setting.executionArgument,
                icon: this.iconSet.operatingSystemSettingsIcon,
                name: setting.name,
                searchable: [setting.name].concat(setting.tags),
            };
        });
    }
}
