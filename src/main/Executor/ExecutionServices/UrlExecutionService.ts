import { SearchResultItem } from "@common/SearchResultItem";
import type { Shell } from "electron";
import type { ExecutionService } from "./ExecutionService";

export class UrlExecutionService implements ExecutionService {
    public constructor(private readonly shell: Shell) {}

    public execute(searchResultItem: SearchResultItem): Promise<void> {
        return this.shell.openExternal(searchResultItem.executionServiceArgument);
    }
}
