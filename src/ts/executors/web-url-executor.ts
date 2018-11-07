import { exec } from "child_process";
import { Injector } from "../injector";
import { Executor } from "./executor";
import { platform } from "os";

export class WebUrlExecutor implements Executor {
    public hideAfterExecution = true;
    public resetUserInputAfterExecution = true;
    public logExecution = false;

    public execute(url: string): void {
        const command = Injector.getOpenUrlWithDefaultBrowserCommand(platform(), url);
        this.handleCommandExecution(command);
    }

    private handleCommandExecution(command: string): void {
        exec(command, (err): void => {
            if (err) {
                throw err;
            }
        });
    }
}
