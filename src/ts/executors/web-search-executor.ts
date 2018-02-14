import { Executor } from "./executor";
import { SearchResultItem } from "../search-engine";
import { Config } from "../config";
import { Injector } from "../injector";
import { exec } from "child_process";

export class WebSearchExecutor implements Executor {
    private webSearches = Config.webSearches;

    public hideAfterExecution(): boolean {
        return true;
    }

    public execute(executionArgument: string): void {
        for (let webSearch of this.webSearches) {
            if (executionArgument.startsWith(`${webSearch.prefix}${Config.webSearchSeparator}`)) {
                let command = Injector.getOpenUrlWithDefaultBrowserCommand(executionArgument);
                exec(command, (err, stout, sterr) => {
                    if (err) {
                        throw err;
                    }
                });
            }
        }
    }
}

export class WebSearch {
    public name: string;
    public prefix: string;
    public url: string;
    public icon: string;
}