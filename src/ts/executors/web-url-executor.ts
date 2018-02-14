import * as childProcess from "child_process";
import { Executor } from "./executor";
import { Injector } from "../injector";
import { SearchResultItem } from "../search-engine";

export class WebUrlExecutor implements Executor {
    public execute(url: string): void {
        let command = Injector.getOpenUrlWithDefaultBrowserCommand(url);
        this.handleCommandExecution(command);
    }

    private handleCommandExecution(command: string): void {
        childProcess.exec(command, (err, stout, sterr) => {
            if (err) {
                throw err;
            }
        });
    }
    
    public hideAfterExecution(): boolean {
        return true;
    }
}
