import { SearchPlugin } from "./search-plugin";
import { SearchResultItem } from "../search-result-item";
import { OperatingSystemCommand } from "../operating-system-settings/operating-system-command";
import { UeliHelpers } from "../helpers/ueli-helpers";
import { OperatingSystem } from "../operating-system";

export class OperatingSystemCommandsPlugin implements SearchPlugin {
    private readonly systemCommands: OperatingSystemCommand[];
    private readonly descriptionPrefix: string;

    constructor(systemCommands: OperatingSystemCommand[], operatingSystem: OperatingSystem) {
        this.systemCommands = systemCommands;
        this.descriptionPrefix = operatingSystem === OperatingSystem.Windows
            ? "Windows"
            : "macOS";
    }

    public getIndexLength(): number {
        return this.systemCommands.length;
    }

    public getAllItems(): SearchResultItem[] {

        return this.systemCommands.map((setting: OperatingSystemCommand): SearchResultItem => {
            return {
                description: `${this.descriptionPrefix} ${UeliHelpers.searchResultDescriptionSeparator} ${setting.name}`,
                executionArgument: setting.executionArgument,
                icon: setting.icon,
                name: setting.name,
                searchable: [setting.name].concat(setting.tags),
            };
        });
    }
}
