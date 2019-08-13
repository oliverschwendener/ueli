import { UeliCommandExecutionArgument } from "./ueli-command-execution-argument";

export interface UeliCommand {
    name: string;
    description: string;
    executionArgument: UeliCommandExecutionArgument;
    hideMainWindowAfterExecution: boolean;
}
