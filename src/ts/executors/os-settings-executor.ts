import { exec } from "child_process";
import { Executor } from "./executor";
import { Injector } from "../injector";

export class OsSettingsExecutor implements Executor {
    private execution = Injector.getOsSettingExecution();
    private validation = Injector.getOsSettingValidation();

    public execute(executionArgument: string): void {
        this.execution(executionArgument);
    }

    public isValidForExecution(executionArgument: string): boolean {
        return this.validation(executionArgument);
    }

    public hideAfterExecution(): boolean {
        return true;
    }
}

export function ExecuteWindowsSetting(executionArgument: string): void {
    let prefix = "win:"
    let command = executionArgument.replace(prefix, "");
    exec(`start "" "${command}"`, (err, stout, sterr) => {
        if (err) {
            throw err;
        }
    });
}

export function IsValidWindowsSettingExecutionArgument(executionArgument: string): boolean {
    let prefix = "win:"
    return executionArgument.startsWith(prefix)
        && executionArgument.length > prefix.length;
}

export function ExecuteMacOsSetting(executionArgument: string): void {
    throw new Error("Method not implemented");
}

export function IsValidMacOsSettingExecutionArgument(executionArgument: string): boolean {
    return false;
}