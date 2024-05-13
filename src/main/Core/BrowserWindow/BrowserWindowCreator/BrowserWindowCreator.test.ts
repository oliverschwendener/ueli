import type { BrowserWindowConstructorOptions } from "electron";
import { describe, expect, it, vi } from "vitest";
import { BrowserWindowCreator } from "./BrowserWindowCreator";

const browserWindowMock = {};
const constructorMock = vi.fn().mockReturnValue(browserWindowMock);

vi.mock("electron", () => {
    return {
        BrowserWindow: class {
            constructor(options: BrowserWindowConstructorOptions) {
                constructorMock(options);
                return browserWindowMock;
            }
        },
    };
});

describe(BrowserWindowCreator, () => {
    describe(BrowserWindowCreator.prototype.create, () => {
        it("should create a BrowserWindow instance with the options provided by the provider", () => {
            const options = <BrowserWindowConstructorOptions>{
                alwaysOnTop: false,
                center: true,
                webPreferences: {
                    preload: "preload.js",
                },
            };

            const browserWindowConstructorOptionsProvider = { get: vi.fn().mockReturnValue(options) };

            expect(new BrowserWindowCreator(browserWindowConstructorOptionsProvider).create()).toBe(browserWindowMock);

            expect(constructorMock).toHaveBeenCalledWith(options);
        });
    });
});
