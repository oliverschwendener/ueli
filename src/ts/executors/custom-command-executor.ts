import { Executor } from "./executor";
import { exec } from "child_process";
import { UeliHelpers } from "../helpers/ueli-helpers";

export class CustomCommandExecutor implements Executor {
    public execute(executionArgument: string): void {
        executionArgument = executionArgument.replace(UeliHelpers.shortcutPrefix, "");

        exec(executionArgument, (err): void => {
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
}
