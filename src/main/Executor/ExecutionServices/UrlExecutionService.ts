import type { ExecutionArgument } from "@common/ExecutionArgument";
import type { Shell } from "electron";
import type { ExecutionService } from "./ExecutionService";

export class UrlExecutionService implements ExecutionService {
    public constructor(private readonly shell: Shell) {}

    public execute(executionArgument: ExecutionArgument): Promise<void> {
        return this.shell.openExternal(executionArgument.searchResultItem.executionServiceArgument);
    }
}
