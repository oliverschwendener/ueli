import * as childProcess from "child_process";
import { Injector } from "../injector";
import { Executor } from "./executor";
import { platform } from "os";

export class WebUrlExecutor implements Executor {
    public execute(url: string): void {
        const command = Injector.getOpenUrlWithDefaultBrowserCommand(platform(), url);
        this.handleCommandExecution(command);
    }

    public hideAfterExecution(): boolean {
        return true;
    }

    private handleCommandExecution(command: string): void {
        childProcess.exec(command, (err, stout, sterr) => {
            if (err) {
                throw err;
            }
        });
    }
}
