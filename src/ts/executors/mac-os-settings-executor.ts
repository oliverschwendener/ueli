import { Executor } from "./executor";
import { MacOsSettingsHelpers } from "../helpers/mac-os-settings.helpers";
import { exec } from "child_process";

export class MacOsSettingsExecutor implements Executor {
    public execute(executionArgument: string): void {
        const command = this.replacePrefix(executionArgument);

        exec(command, (err): void => {
            if (err) {
                throw err;
            }
        });
    }
    public hideAfterExecution(): boolean {
        return true;
    }
    public resetUserInputAfterExecution(): boolean {
        return true;
    }

    public logExecution(): boolean {
        return true;
    }

    private replacePrefix(executionArgument: string): string {
        return executionArgument.replace(MacOsSettingsHelpers.macOsSettingsPrefix, "");
    }
}
