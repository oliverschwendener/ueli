import { Searcher } from "./searcher";
import { Config } from "../config";
import { SearchResultItem } from "../search-engine";

export class CommandLineSearcher implements Searcher {
    private icon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" version="1.1">
                        <g id="surface1">
                            <path d="M 4 5 L 4 27 L 28 27 L 28 5 Z M 6 7 L 26 7 L 26 9 L 6 9 Z M 6 11 L 26 11 L 26 25 L 6 25 Z M 11.21875 13.78125 L 9.78125 15.21875 L 12.5625 18 L 9.78125 20.78125 L 11.21875 22.21875 L 14.71875 18.71875 L 15.40625 18 L 14.71875 17.28125 Z M 16 20 L 16 22 L 22 22 L 22 20 Z "></path>
                        </g>
                    </svg>`;

    public getSearchResult(userInput: string): SearchResultItem[] {
        let command = userInput.replace(Config.commandLinePrefix, "");

        return [
            <SearchResultItem>{
                name: `Execute ${command}`,
                executionArgument: userInput,
                icon: this.icon,
                tags: []
            }
        ];
    }
}