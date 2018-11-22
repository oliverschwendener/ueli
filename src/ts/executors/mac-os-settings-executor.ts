import { Executor } from "./executor";
import { MacOsSettingsHelpers } from "../helpers/mac-os-settings.helpers";
import { exec } from "child_process";

export class MacOsSettingsExecutor implements Executor {
    public readonly hideAfterExecution = true;
    public readonly resetUserInputAfterExecution = true;
    public readonly logExecution = true;

    public execute(executionArgument: string): void {
        const command = this.replacePrefix(executionArgument);

        exec(command, (err): void => {
            if (err) {
                throw err;
            }
        });
    }

    private replacePrefix(executionArgument: string): string {
        return executionArgument.replace(MacOsSettingsHelpers.macOsSettingsPrefix, "");
    }
}
