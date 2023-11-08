import type { EventEmitter } from "@common/EventEmitter";
import type { SearchResultItemAction } from "@common/SearchResultItemAction";
import { describe, expect, it, vi } from "vitest";
import type { ActionHandler } from "./ActionHandlers";
import { ActionInvoker } from "./ActionInvoker";

describe(ActionInvoker, () => {
    it("should find the corresponding execution service and call its 'execute' method", async () => {
        const searchResultItem = <SearchResultItemAction>{ handlerId: "handlerId1" };

        const invokeMock = vi.fn().mockReturnValue(Promise.resolve());
        const emitEventMock = vi.fn();

        const actionHandler = <ActionHandler>{
            invoke: (action) => invokeMock(action),
        };

        const eventEmitter = <EventEmitter>{
            emitEvent: (eventName: string) => emitEventMock(eventName),
        };

        await new ActionInvoker({ handlerId1: actionHandler }, eventEmitter).invoke(searchResultItem);

        expect(invokeMock).toHaveBeenCalledWith(searchResultItem);
        expect(emitEventMock).toHaveBeenCalledWith("actionInvokationSucceeded");
    });

    it("should throw an error if the search result item points to an unknown execution service", async () => {
        const searchResultItem = <SearchResultItemAction>{ handlerId: "handlerId1" };
        const eventEmitter = <EventEmitter>{};

        await expect(new ActionInvoker({}, eventEmitter).invoke(searchResultItem)).rejects.toThrowError(
            "Unable to find action handler by id: 'handlerId1'",
        );
    });
});
