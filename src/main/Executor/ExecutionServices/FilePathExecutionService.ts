import type { ExecutionArgument } from "@common/ExecutionArgument";
import type { Shell } from "electron";
import type { ExecutionService } from "./ExecutionService";

export class FilePathExecutionService implements ExecutionService {
    public constructor(private readonly shell: Shell) {}

    public execute(executionArgument: ExecutionArgument): Promise<void> {
        return this.openFilePath(executionArgument.searchResultItem.executionServiceArgument);
    }

    private async openFilePath(filePath: string): Promise<void> {
        const errorMessage = await this.shell.openPath(filePath);

        if (errorMessage) {
            throw new Error(errorMessage);
        }
    }
}
