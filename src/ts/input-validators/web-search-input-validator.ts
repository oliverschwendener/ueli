import { InputValidator } from "./input-validator";
import { WebSearchHelpers } from "../helpers/web-search-helper";
import { WebSearch } from "../web-search";

export class WebSearchInputValidator implements InputValidator {
    private webSearches: WebSearch[];

    constructor(webSearches: WebSearch[]) {
        this.webSearches = webSearches;
    }

    public isValidForSearchResults(userInput: string): boolean {
        for (const webSearch of this.webSearches) {
            const prefix = `${webSearch.prefix}${WebSearchHelpers.webSearchSeparator}`;
            if (userInput.startsWith(prefix)) {
                return true;
            }
        }

        return false;
    }
}
