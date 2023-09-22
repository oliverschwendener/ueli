import type { ExecutionArgument } from "@common/ExecutionArgument";
import type { EventEmitter } from "../EventEmitter";
import type { ExecutionService } from "./ExecutionServices/ExecutionService";

export class Executor {
    public constructor(
        private readonly executionServices: Record<string, ExecutionService>,
        private readonly eventEmitter: EventEmitter,
    ) {}

    public async execute(executionArgument: ExecutionArgument): Promise<void> {
        const { searchResultItem } = executionArgument;
        const { executionServiceId } = searchResultItem;

        const executionService = this.executionServices[executionServiceId];

        if (!executionService) {
            throw new Error(`Unable to find execution service by id: '${executionServiceId}'`);
        }

        await executionService.execute(executionArgument);

        this.eventEmitter.emitEvent("executionSucceeded", { searchResultItem });
    }
}
