import { exec } from "child_process";
import { Executor } from "./executor";
import { WindowsSettingsHelpers } from "../helpers/windows-settings-helpers";

export class WindowsSettingsExecutor implements Executor {
    public readonly hideAfterExecution = true;
    public readonly resetUserInputAfterExecution = true;
    public readonly logExecution = true;

    public execute(executionArgument: string): void {
        const command = this.replacePrefix(executionArgument);

        exec(`start ${command}`, (err): void => {
            if (err) {
                throw err;
            }
        });
    }

    private replacePrefix(executionArgument: string): string {
        return executionArgument.replace(WindowsSettingsHelpers.windowsSettingsPrefix, "");
    }
}
