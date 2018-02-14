import { ExecutionArgumentValidator } from "./execution-argument-validator";
import { WebSearch } from "../executors/web-search-executor";
import { Config } from "../config";

export class WebSearchExecutionArgumentValidator implements ExecutionArgumentValidator {
    private webSearches = Config.webSearches;

    public isValidForExecution(executionArgument: string): boolean {
        for (let webSearch of this.webSearches) {
            let prefix = `${webSearch.prefix}${Config.webSearchSeparator}`
            if (executionArgument.startsWith(prefix))
                return true;
        }

        return false;
    }
}