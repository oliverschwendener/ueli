import type { Shell } from "electron";
import type { EventEmitter } from "../EventEmitter";
import { FilePathExecutionService, UrlExecutionService } from "./ExecutionServices";
import { Executor } from "./Executor";

export const useExecutor = ({ shell, eventEmitter }: { shell: Shell; eventEmitter: EventEmitter }) => {
    return new Executor(
        {
            FilePath: new FilePathExecutionService(shell),
            URL: new UrlExecutionService(shell),
        },
        eventEmitter,
    );
};
