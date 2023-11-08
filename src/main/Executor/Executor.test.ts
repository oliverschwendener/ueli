import type { EventEmitter } from "@common/EventEmitter";
import type { SearchResultItem } from "@common/SearchResultItem";
import { describe, expect, it, vi } from "vitest";
import type { ExecutionService } from "./ExecutionServices/ExecutionService";
import { Executor } from "./Executor";

describe(Executor, () => {
    it("should find the corresponding execution service and call its 'execute' method", async () => {
        const searchResultItem = <SearchResultItem>{ executionServiceId: "executionServiceId1" };

        const executeMock = vi.fn().mockReturnValue(Promise.resolve());
        const emitEventMock = vi.fn();

        const executionService = <ExecutionService>{
            execute: (searchResultItem: SearchResultItem) => executeMock(searchResultItem),
        };

        const eventEmitter = <EventEmitter>{
            emitEvent: (eventName: string) => emitEventMock(eventName),
        };

        await new Executor({ executionServiceId1: executionService }, eventEmitter).execute(searchResultItem);

        expect(executeMock).toHaveBeenCalledWith(searchResultItem);
        expect(emitEventMock).toHaveBeenCalledWith("executionSucceeded");
    });

    it("should throw an error if the search result item points to an unknown execution service", async () => {
        const searchResultItem = <SearchResultItem>{ executionServiceId: "executionService1" };
        const eventEmitter = <EventEmitter>{};

        await expect(new Executor({}, eventEmitter).execute(searchResultItem)).rejects.toThrowError(
            "Unable to find execution service by id: 'executionService1'",
        );
    });
});
