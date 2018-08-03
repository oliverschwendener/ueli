import { SearchPlugin } from "./search-plugin";
import { SearchResultItem } from "../search-result-item";
import { CustomCommand } from "../custom-command";
import { StringHelpers } from "../helpers/string-helpers";

export class CustomCommandsPlugin implements SearchPlugin {
    private items: SearchResultItem[];
    private defaultIcon: string;

    constructor(customCommands: CustomCommand[], defaultIcon: string) {
        this.defaultIcon = defaultIcon;
        this.items = this.convertToSearchResultItems(customCommands);
    }

    public getAllItems(): SearchResultItem[] {
        return this.items;
    }

    private convertToSearchResultItems(customCommands: CustomCommand[]): SearchResultItem[] {
        const result = [] as SearchResultItem[];

        for (const customCommand of customCommands) {
            result.push({
                executionArgument: customCommand.executionArgument,
                icon: StringHelpers.stringIsWhiteSpace(customCommand.icon)
                    ? this.defaultIcon
                    : customCommand.icon,
                name: customCommand.name,
                searchable: [customCommand.name],
                tags: [],
            });
        }

        return result;
    }
}
