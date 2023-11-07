import type { App, BrowserWindow } from "electron";
import { describe, expect, it, vi } from "vitest";
import { ElectronBrowserWindowToggler } from "./ElectronBrowserWindowToggler";

describe(ElectronBrowserWindowToggler, () => {
    it("should hide the window if it is visible and focussed", () => {
        const appHideMock = vi.fn();
        const browserWindowHideMock = vi.fn();

        const app = <App>{
            hide: () => appHideMock(),
        };

        const browserWindow = <BrowserWindow>{
            isVisible: () => true,
            isFocused: () => true,
            hide: () => browserWindowHideMock(),
        };

        new ElectronBrowserWindowToggler(app, browserWindow).toggleWindow();

        expect(appHideMock).toHaveBeenCalledOnce();
        expect(browserWindowHideMock).toHaveBeenCalledOnce();
    });

    it("should hide the window if it is visible and focussed (on Windows)", () => {
        const browserWindowHideMock = vi.fn();

        const browserWindow = <BrowserWindow>{
            isVisible: () => true,
            isFocused: () => true,
            hide: () => browserWindowHideMock(),
        };

        new ElectronBrowserWindowToggler(<App>{}, browserWindow).toggleWindow();

        expect(browserWindowHideMock).toHaveBeenCalledOnce();
    });

    it("should show and focus the window if its hidden", () => {
        const appShowMock = vi.fn();
        const browserWindowShowMock = vi.fn();
        const browserWindowFocusMock = vi.fn();
        const sendMock = vi.fn();

        const app = <App>{
            show: () => appShowMock(),
        };

        const browserWindow = <BrowserWindow>{
            isVisible: () => false,
            isFocused: () => false,
            show: () => browserWindowShowMock(),
            focus: () => browserWindowFocusMock(),
            webContents: {
                send: (channel) => sendMock(channel),
            },
        };

        new ElectronBrowserWindowToggler(app, browserWindow).toggleWindow();

        expect(appShowMock).toHaveBeenCalledOnce();
        expect(browserWindowShowMock).toHaveBeenCalledOnce();
        expect(browserWindowFocusMock).toHaveBeenCalledOnce();
        expect(sendMock).toHaveBeenCalledWith("windowFocused");
    });

    it("should show and focus the window if its hidden (on Windows)", () => {
        const browserWindowShowMock = vi.fn();
        const browserWindowFocusMock = vi.fn();
        const sendMock = vi.fn();

        const browserWindow = <BrowserWindow>{
            isVisible: () => false,
            isFocused: () => false,
            show: () => browserWindowShowMock(),
            focus: () => browserWindowFocusMock(),
            webContents: {
                send: (channel) => sendMock(channel),
            },
        };

        new ElectronBrowserWindowToggler(<App>{}, browserWindow).toggleWindow();

        expect(browserWindowShowMock).toHaveBeenCalledOnce();
        expect(browserWindowFocusMock).toHaveBeenCalledOnce();
        expect(sendMock).toHaveBeenCalledWith("windowFocused");
    });

    it("should show and focus the window if its visible but not focused", () => {
        const appShowMock = vi.fn();
        const browserWindowShowMock = vi.fn();
        const browserWindowFocusMock = vi.fn();
        const sendMock = vi.fn();

        const app = <App>{
            show: () => appShowMock(),
        };

        const browserWindow = <BrowserWindow>{
            isVisible: () => true,
            isFocused: () => false,
            show: () => browserWindowShowMock(),
            focus: () => browserWindowFocusMock(),
            webContents: {
                send: (channel) => sendMock(channel),
            },
        };

        new ElectronBrowserWindowToggler(app, browserWindow).toggleWindow();

        expect(appShowMock).toHaveBeenCalledOnce();
        expect(browserWindowShowMock).toHaveBeenCalledOnce();
        expect(browserWindowFocusMock).toHaveBeenCalledOnce();
        expect(sendMock).toHaveBeenCalledWith("windowFocused");
    });
});
