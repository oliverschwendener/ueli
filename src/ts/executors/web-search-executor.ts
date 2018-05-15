import { exec } from "child_process";
import { Injector } from "../injector";
import { Executor } from "./executor";
import { platform } from "os";
import { WebSearchHelpers } from "../helpers/web-search-helper";
import { WebSearch } from "../web-search";

export class WebSearchExecutor implements Executor {
    private webSearches: WebSearch[];

    constructor(webSearches: WebSearch[]) {
        this.webSearches = webSearches;
    }

    public hideAfterExecution(): boolean {
        return true;
    }

    public resetUserInputAfterExecution(): boolean {
        return true;
    }

    public logExecute(): boolean {
        return false;
    }

    public execute(executionArgument: string): void {
        for (const webSearch of this.webSearches) {
            if (executionArgument.startsWith(`${webSearch.prefix}${WebSearchHelpers.webSearchSeparator}`)) {
                const command = Injector.getOpenUrlWithDefaultBrowserCommand(platform(), executionArgument);
                exec(command, (err, stout, sterr) => {
                    if (err) {
                        throw err;
                    }
                });
            }
        }
    }
}
