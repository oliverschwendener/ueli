import { exec } from "child_process";
import { Injector } from "../injector";
import { Executor } from "./executor";
import { platform } from "os";
import { WebSearchHelpers } from "../helpers/web-search-helper";
import { WebSearch } from "../web-search";

export class WebSearchExecutor implements Executor {
    public readonly hideAfterExecution = true;
    public readonly resetUserInputAfterExecution = true;
    public readonly logExecution = false;

    private readonly webSearches: WebSearch[];

    constructor(webSearches: WebSearch[]) {
        this.webSearches = webSearches;
    }

    public execute(executionArgument: string): void {
        for (const webSearch of this.webSearches) {
            if (executionArgument.startsWith(`${webSearch.prefix}${WebSearchHelpers.webSearchSeparator}`)) {
                const command = Injector.getOpenUrlWithDefaultBrowserCommand(platform(), executionArgument);
                exec(command, (err): void => {
                    if (err) {
                        throw err;
                    }
                });
            }
        }
    }
}
