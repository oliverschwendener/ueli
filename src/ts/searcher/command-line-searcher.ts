import { SearchResultItem } from "../search-result-item";
import { Searcher } from "./searcher";
import { CommandLineHelpers } from "../helpers/command-line-helpers";
import { IconSet } from "../icon-sets/icon-set";

export class CommandLineSearcher implements Searcher {
    private iconSet: IconSet;

    constructor(iconSet: IconSet) {
        this.iconSet = iconSet;
    }

    public getSearchResult(userInput: string): SearchResultItem[] {
        const command = userInput.replace(CommandLineHelpers.commandLinePrefix, "");

        return [
            {
                description: `Execute ${command}`,
                executionArgument: userInput,
                icon: this.iconSet.commandLineIcon,
                name: command,
                searchable: [],
                tags: [],
            } as SearchResultItem,
        ];
    }
}
