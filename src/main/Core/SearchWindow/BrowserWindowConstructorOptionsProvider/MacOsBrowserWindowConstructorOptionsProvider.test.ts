import type { BrowserWindowVibrancyProvider } from "@Core/BrowserWindow";
import type { BrowserWindowConstructorOptions } from "electron";
import { describe, expect, it, vi } from "vitest";
import { MacOsBrowserWindowConstructorOptionsProvider } from "./MacOsBrowserWindowConstructorOptionsProvider";

describe(MacOsBrowserWindowConstructorOptionsProvider, () => {
    describe(MacOsBrowserWindowConstructorOptionsProvider.prototype.get, () => {
        it("should return the macOS window options", () => {
            const defaultOptions = <BrowserWindowConstructorOptions>{
                alwaysOnTop: true,
                vibrancy: undefined,
            };

            const getVibrancyMock = vi.fn().mockReturnValue("content");

            const vibrancyProvider = <BrowserWindowVibrancyProvider>{ get: () => getVibrancyMock() };

            const actual = new MacOsBrowserWindowConstructorOptionsProvider(defaultOptions, vibrancyProvider).get();

            expect(actual).toEqual(<BrowserWindowConstructorOptions>{
                alwaysOnTop: true,
                vibrancy: "content",
                backgroundColor: "rgba(0,0,0,0)",
            });

            expect(getVibrancyMock).toHaveBeenCalledOnce();
        });
    });
});
