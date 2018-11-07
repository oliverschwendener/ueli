import { Executor } from "./executor";
import { MacOsSettingsHelpers } from "../helpers/mac-os-settings.helpers";
import { exec } from "child_process";

export class MacOsSettingsExecutor implements Executor {
    public hideAfterExecution = true;
    public resetUserInputAfterExecution = true;
    public logExecution = true;

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
