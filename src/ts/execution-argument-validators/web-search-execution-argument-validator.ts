import { ExecutionArgumentValidator } from "./execution-argument-validator";
import { WebSearchHelpers } from "../helpers/web-search-helper";
import { WebSearch } from "../web-search";

export class WebSearchExecutionArgumentValidator implements ExecutionArgumentValidator {
    private readonly webSearches: WebSearch[];

    constructor(webSearches: WebSearch[]) {
        this.webSearches = webSearches;
    }

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
