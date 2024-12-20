import type { EventEmitter } from "@Core/EventEmitter";
import type { SearchResultItemAction } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import { NavigateToActionHandler } from "./NavigateToActionHandler";

describe(NavigateToActionHandler, () => {
    it("should navigate to pathname", async () => {
        const emitEventMock = vi.fn();
        const eventEmitter = <EventEmitter>{ emitEvent: (event, data) => emitEventMock(event, data) };

        const actionHandler = new NavigateToActionHandler(eventEmitter);
        await actionHandler.invokeAction(<SearchResultItemAction>{ argument: "pathname" });

        expect(actionHandler.id).toEqual("navigateTo");
        expect(emitEventMock).toHaveBeenCalledWith("navigateTo", { pathname: "pathname" });
    });
});
