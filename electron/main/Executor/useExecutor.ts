import type { Shell } from "electron";
import type { EventEmitter } from "../EventEmitter";
import { FilePathExecutionService, UrlExecutionService } from "./ExecutionServices";
import { Executor } from "./Executor";

export const useExecutor = ({ shell, eventEmitter }: { shell: Shell; eventEmitter: EventEmitter }) => {
    return new Executor(
        {
            FilePath: new FilePathExecutionService(
                async (filePath: string) => {
                    const errorMessage = await shell.openPath(filePath);

                    if (errorMessage) {
                        throw new Error(errorMessage);
                    }
                },
                async (filePath: string) => {
                    shell.showItemInFolder(filePath);
                },
            ),
            URL: new UrlExecutionService(shell.openExternal),
        },
        eventEmitter,
    );
};
