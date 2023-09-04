import type { ExecutionArgument } from "@common/ExecutionArgument";
import { EventEmitter } from "../EventEmitter";
import type { ExecutionService } from "./ExecutionServices/ExecutionService";

export class Executor {
    public constructor(
        private readonly executionServices: Record<string, ExecutionService>,
        private readonly eventEmitter: EventEmitter,
    ) {}

    public async execute(executionArgument: ExecutionArgument): Promise<void> {
        const executionService = this.executionServices[executionArgument.searchResultItem.executionServiceId];

        if (!executionService) {
            throw new Error(
                `Unable to find execution service by id: '${executionArgument.searchResultItem.executionServiceId}'`,
            );
        }

        await executionService.execute(executionArgument);

        this.eventEmitter.emitEvent("executionSucceeded");
    }
}
