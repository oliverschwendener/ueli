import { SearchPlugin } from "./search-plugin";
import { SearchResultItem } from "../search-result-item";
import { Shortcut } from "../shortcut";
import { StringHelpers } from "../helpers/string-helpers";

export class ShortcutsPlugin implements SearchPlugin {
    private items: SearchResultItem[];
    private defaultIcon: string;

    constructor(shortcuts: Shortcut[], defaultIcon: string) {
        this.defaultIcon = defaultIcon;
        this.items = this.convertToSearchResultItems(shortcuts);
    }

    public getAllItems(): SearchResultItem[] {
        return this.items;
    }

    private convertToSearchResultItems(shortcuts: Shortcut[]): SearchResultItem[] {
        const result = [] as SearchResultItem[];

        for (const shortcut of shortcuts) {
            result.push({
                description: shortcut.executionArgument,
                executionArgument: shortcut.executionArgument,
                icon: StringHelpers.stringIsWhiteSpace(shortcut.icon)
                    ? this.defaultIcon
                    : shortcut.icon,
                name: shortcut.name,
                searchable: [shortcut.name],
            });
        }

        return result;
    }
}
