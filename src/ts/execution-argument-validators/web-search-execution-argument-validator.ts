import { Config } from "../config";
import { ExecutionArgumentValidator } from "./execution-argument-validator";
import { WebSearchHelpers } from "../helpers/web-search-helper";

export class WebSearchExecutionArgumentValidator implements ExecutionArgumentValidator {
    private webSearches = Config.webSearches;

    public isValidForExecution(executionArgument: string): boolean {
        for (const webSearch of this.webSearches) {
            const prefix = `${webSearch.prefix}${WebSearchHelpers.webSearchSeparator}`;
            if (executionArgument.startsWith(prefix)) {
                return true;
            }
        }

        return false;
    }
}
