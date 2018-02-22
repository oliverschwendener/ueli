import { Config } from "../config";
import { ExecutionArgumentValidator } from "./execution-argument-validator";

export class WebSearchExecutionArgumentValidator implements ExecutionArgumentValidator {
    private webSearches = Config.webSearches;

    public isValidForExecution(executionArgument: string): boolean {
        for (const webSearch of this.webSearches) {
            const prefix = `${webSearch.prefix}${Config.webSearchSeparator}`;
            if (executionArgument.startsWith(prefix)) {
                return true;
            }
        }

        return false;
    }
}
