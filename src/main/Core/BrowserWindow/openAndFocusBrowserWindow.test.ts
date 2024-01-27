import type { BrowserWindow } from "electron";
import { describe, expect, it, vi } from "vitest";
import { openAndFocusBrowserWindow } from "./openAndFocusBrowserWindow";

describe(openAndFocusBrowserWindow, () => {
    it("should open and focus a browser window, when it's not visible", () => {
        const showMock = vi.fn();
        const focusMock = vi.fn();

        const browserWindow = <BrowserWindow>{
            isVisible: () => false,
            show: () => showMock(),
            focus: () => focusMock(),
        };

        openAndFocusBrowserWindow(browserWindow);

        expect(showMock).toHaveBeenCalledOnce();
        expect(focusMock).toHaveBeenCalledOnce();
    });

    it("should only focus a browser window, when it's already visible", () => {
        const focusMock = vi.fn();

        const browserWindow = <BrowserWindow>{
            isVisible: () => true,
            focus: () => focusMock(),
        };

        openAndFocusBrowserWindow(browserWindow);

        expect(focusMock).toHaveBeenCalledOnce();
    });
});
