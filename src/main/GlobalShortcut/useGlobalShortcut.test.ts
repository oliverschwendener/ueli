import type { BrowserWindowToggler } from "@common/BrowserWindowToggler";
import type { GlobalShortcut } from "electron";
import { describe, expect, it, vi } from "vitest";
import { useGlobalShortcut } from "./useGlobalShortcut";

describe(useGlobalShortcut, () => {
    it("should register the global shortcut", () => {
        const registerMock = vi.fn();

        const browserWindowToggler = <BrowserWindowToggler>{};
        const globalShortcut = <GlobalShortcut>{
            register: (accelerator, callback) => registerMock(accelerator, callback),
        };

        useGlobalShortcut({ globalShortcut, browserWindowToggler });

        expect(registerMock).toHaveBeenCalledWith("alt+space", browserWindowToggler.toggleWindow);
    });
});
