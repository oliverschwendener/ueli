import type { Shell } from "electron";
import type { EventEmitter } from "../EventEmitter";
import { CommandlineUtility } from "../Utilities";
import { FilePathExecutionService, UrlExecutionService } from "./ExecutionServices";
import { PowershellExecutionService } from "./ExecutionServices/PowershellExecutionService";
import { Executor } from "./Executor";

export const useExecutor = ({
    commandlineUtility,
    eventEmitter,
    shell,
}: {
    commandlineUtility: CommandlineUtility;
    eventEmitter: EventEmitter;
    shell: Shell;
}) => {
    return new Executor(
        {
            FilePath: new FilePathExecutionService(shell),
            URL: new UrlExecutionService(shell),
            Powershell: new PowershellExecutionService(commandlineUtility),
        },
        eventEmitter,
    );
};
