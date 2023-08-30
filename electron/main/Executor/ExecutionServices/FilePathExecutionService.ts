import type { ExecutionArgument } from "@common/ExecutionArgument";
import type { ExecutionService } from "./ExecutionService";

export class FilePathExecutionService implements ExecutionService {
    public constructor(private readonly openFilePath: (filePath: string) => Promise<void>) {}

    public execute(executionArgument: ExecutionArgument): Promise<void> {
        return this.openFilePath(executionArgument.searchResultItem.executorArgument);
    }
}
