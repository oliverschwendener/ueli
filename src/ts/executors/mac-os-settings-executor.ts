import { Executor } from "./executor";

export class MacOsSettingsExecutor implements Executor {
    public execute(executionArgument: string): void {
        throw new Error("Method not implemented.");
    }
    public hideAfterExecution(): boolean {
        throw new Error("Method not implemented.");
    }

    public logExecute(): boolean {
        return true;
    }

    public resetUserInputAfterExecution(): boolean {
        throw new Error("Method not implemented.");
    }
}
