import type { Shell } from "electron";
import type { EventEmitter } from "../EventEmitter";
import type { CommandlineUtility } from "../Utilities";
import {
    CommandlineExecutionService,
    FilePathExecutionService,
    PowershellExecutionService,
    UrlExecutionService,
} from "./ExecutionServices";
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
            Commandline: new CommandlineExecutionService(commandlineUtility),
        },
        eventEmitter,
    );
};
