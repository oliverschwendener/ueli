import type { ExecutionArgument } from "@common/ExecutionArgument";
import { describe, expect, it, vi } from "vitest";
import type { EventEmitter } from "../EventEmitter";
import type { ExecutionService } from "./ExecutionServices/ExecutionService";
import { Executor } from "./Executor";

describe(Executor, () => {
    it("should find the corresponding execution service and call its 'execute' method", async () => {
        const executionArgument = <ExecutionArgument>{
            searchResultItem: { executionServiceId: "executionServiceId1" },
        };

        const executeMock = vi.fn().mockReturnValue(Promise.resolve());
        const emitEventMock = vi.fn();

        const executionService = <ExecutionService>{
            execute: (executionArgument: ExecutionArgument) => executeMock(executionArgument),
        };

        const eventEmitter = <EventEmitter>{
            emitEvent: (eventName: string) => emitEventMock(eventName),
        };

        await new Executor({ executionServiceId1: executionService }, eventEmitter).execute(executionArgument);

        expect(executeMock).toHaveBeenCalledWith(executionArgument);
        expect(emitEventMock).toHaveBeenCalledWith("executionSucceeded");
    });

    it("should throw an error if the search result item points to an unknown execution service", async () => {
        const executionArgument = <ExecutionArgument>{ searchResultItem: { executionServiceId: "executionService1" } };
        const eventEmitter = <EventEmitter>{};

        await expect(new Executor({}, eventEmitter).execute(executionArgument)).rejects.toThrowError(
            "Unable to find execution service by id: 'executionService1'",
        );
    });
});
