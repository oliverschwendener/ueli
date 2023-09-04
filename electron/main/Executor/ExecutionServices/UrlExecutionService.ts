import type { ExecutionArgument } from "@common/ExecutionArgument";
import type { ExecutionService } from "./ExecutionService";

export class UrlExecutionService implements ExecutionService {
    public constructor(private readonly openUrl: (url: string) => Promise<void>) {}

    public execute(executionArgument: ExecutionArgument): Promise<void> {
        return this.openUrl(executionArgument.searchResultItem.executionServiceArgument);
    }
}
