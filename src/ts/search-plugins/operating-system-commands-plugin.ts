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

        return this.systemCommands.map((operatingSystemCommand: OperatingSystemCommand): SearchResultItem => {
            return {
                description: `${this.descriptionPrefix} ${UeliHelpers.searchResultDescriptionSeparator} ${operatingSystemCommand.name}`,
                executionArgument: operatingSystemCommand.executionArgument,
                icon: operatingSystemCommand.icon,
                name: operatingSystemCommand.name,
                needsUserConfirmationBeforeExecution: operatingSystemCommand.needsUserConfirmationBeforeExecution,
                searchable: [operatingSystemCommand.name].concat(operatingSystemCommand.tags),
            };
        });
    }
}
