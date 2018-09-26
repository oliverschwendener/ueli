import { SearchResultItem } from "../search-result-item";
import { SearchPlugin } from "./search-plugin";
import { MacOsSettingsHelpers } from "../helpers/mac-os-settings.helpers";
import { IconSet } from "../icon-sets/icon-set";
import { MacOsSetting } from "../operating-system-settings/macos/mac-os-setting";
import { allMacOsSettings } from "../operating-system-settings/macos/mac-os-settings";
import { UeliHelpers } from "../helpers/ueli-helpers";
import { basename } from "path";

export class MacOsSettingsPlugin implements SearchPlugin {
    private iconSet: IconSet;
    private settings: MacOsSetting[];

    constructor(iconSet: IconSet) {
        this.iconSet = iconSet;

        this.settings = [];
        this.settings = this.settings.concat(allMacOsSettings);
    }

    public getAllItems(): SearchResultItem[] {
        return this.settings.map((setting: MacOsSetting): SearchResultItem => {
            return {
                description: `System Preferences ${UeliHelpers.searchResultDescriptionSeparator} ${basename(setting.executionArgument)}`,
                executionArgument: setting.executionArgument,
                icon: this.iconSet.operatingSystemSettingsIcon,
                name: setting.name,
                searchable: [setting.name].concat(setting.tags),
                tags: setting.tags,
            };
        });
    }
}
