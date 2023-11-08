import type { EventEmitter } from "@common/EventEmitter";
import type { SearchResultItem } from "@common/SearchResultItem";
import type { ExecutionService } from "./ExecutionServices/ExecutionService";

export class Executor {
    public constructor(
        private readonly executionServices: Record<string, ExecutionService>,
        private readonly eventEmitter: EventEmitter,
    ) {}

    public async execute(searchResultItem: SearchResultItem): Promise<void> {
        const { executionServiceId } = searchResultItem;

        const executionService = this.executionServices[executionServiceId];

        if (!executionService) {
            throw new Error(`Unable to find execution service by id: '${executionServiceId}'`);
        }

        await executionService.execute(searchResultItem);

        this.eventEmitter.emitEvent("executionSucceeded", { searchResultItem });
    }
}
