import { InputValidator } from "./input-validator";
import { Config } from "../config";

export class WebSearchInputValidator implements InputValidator {
    private webSearches = Config.webSearches;

    public isValidForSearchResults(userInput: string): boolean {
        for (let webSearch of this.webSearches) {
            let prefix = `${webSearch.prefix}${Config.webSearchSeparator}`
            if (userInput.startsWith(prefix)) {
                return true;
            }
        }

        return false;
    }
}