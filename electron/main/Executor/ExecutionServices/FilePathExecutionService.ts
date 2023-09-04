import type { ExecutionArgument } from "@common/ExecutionArgument";
import type { ExecutionService } from "./ExecutionService";

export class FilePathExecutionService implements ExecutionService {
    public constructor(
        private readonly openFilePath: (filePath: string) => Promise<void>,
        private readonly openFilePathLocation: (filePath: string) => Promise<void>,
    ) {}

    public execute(executionArgument: ExecutionArgument): Promise<void> {
        return executionArgument.isAlternativeExecution
            ? this.openFilePathLocation(executionArgument.searchResultItem.executionServiceArgument)
            : this.openFilePath(executionArgument.searchResultItem.executionServiceArgument);
    }
}
