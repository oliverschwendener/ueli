import { Config } from "../config";
import { InputValidator } from "./input-validator";

export class WebSearchInputValidator implements InputValidator {
    private webSearches = Config.webSearches;

    public isValidForSearchResults(userInput: string): boolean {
        for (const webSearch of this.webSearches) {
            const prefix = `${webSearch.prefix}${Config.webSearchSeparator}`;
            if (userInput.startsWith(prefix)) {
                return true;
            }
        }

        return false;
    }
}
