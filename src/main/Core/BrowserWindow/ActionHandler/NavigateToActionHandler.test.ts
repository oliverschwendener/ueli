import type { BrowserWindowNotifier } from "@Core/BrowserWindowNotifier";
import type { SearchResultItemAction } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import { NavigateToActionHandler } from "./NavigateToActionHandler";

describe(NavigateToActionHandler, () => {
    it("should navigate to pathname", async () => {
        const notifyMock = vi.fn();

        const browserWindowNotifier = <BrowserWindowNotifier>{
            notify: (a) => notifyMock(a),
        };

        const actionHandler = new NavigateToActionHandler(browserWindowNotifier);

        await actionHandler.invokeAction(<SearchResultItemAction>{
            argument: JSON.stringify({
                browserWindowId: "window1",
                pathname: "pathname",
            }),
        });

        expect(actionHandler.id).toEqual("navigateTo");

        expect(notifyMock).toHaveBeenCalledWith({
            browserWindowId: "window1",
            channel: "navigateTo",
            data: { pathname: "pathname" },
        });
    });
});
