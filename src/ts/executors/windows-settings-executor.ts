import { exec } from "child_process";
import { Executor } from "./executor";
import { Config } from "../config";

export class WindowsSettingsExecutor implements Executor {
    public execute(executionArgument: string): void {
        let command = this.replacePrefix(executionArgument);

        exec(`start ${command}`, (err, stdout, sterr): void => {
            if (err) {
                throw err;
            }
        });
    }

    public hideAfterExecution(): boolean {
        return true;
    }

    private replacePrefix(executionArgument: string): string {
        return executionArgument.replace(Config.windowsSettingsPrefix, "");
    }
}