import type { OperatingSystem } from "@common/Core";
import type { App, BrowserWindow } from "electron";
import { describe, expect, it, vi } from "vitest";
import { BrowserWindowToggler } from "./BrowserWindowToggler";

describe(BrowserWindowToggler, () => {
    const createBrowserWindow = ({ isFocused, isVisible }: { isVisible: boolean; isFocused: boolean }) => {
        const centerMock = vi.fn();
        const focusMock = vi.fn();
        const hideMock = vi.fn();
        const isFocusedMock = vi.fn().mockReturnValue(isFocused);
        const isVisibleMock = vi.fn().mockReturnValue(isVisible);
        const minimizeMock = vi.fn();
        const restoreMock = vi.fn();
        const setBoundsMock = vi.fn();
        const showMock = vi.fn();
        const webContentsSendMock = vi.fn();

        const browserWindow = <BrowserWindow>{
            center: () => centerMock(),
            focus: () => focusMock(),
            hide: () => hideMock(),
            isFocused: () => isFocusedMock(),
            isVisible: () => isVisibleMock(),
            minimize: () => minimizeMock(),
            restore: () => restoreMock(),
            setBounds: (b) => setBoundsMock(b),
            show: () => showMock(),
            webContents: { send: (c) => webContentsSendMock(c) },
        };

        return {
            browserWindow,
            centerMock,
            focusMock,
            hideMock,
            isFocusedMock,
            isVisibleMock,
            minimizeMock,
            restoreMock,
            setBoundsMock,
            showMock,
            webContentsSendMock,
        };
    };

    const createApp = () => {
        const showMock = vi.fn();
        const hideMock = vi.fn();

        const app = <App>{ show: () => showMock(), hide: () => hideMock() };

        return { app, showMock, hideMock };
    };

    describe(BrowserWindowToggler.prototype.toggle, () => {
        it("should show and focus the window if its visible but not focused, re-centering it and resizing it to the default size", () => {
            const testShowAndFocus = ({ operatingSystem }: { operatingSystem: OperatingSystem }) => {
                const { app, showMock: appShowMock } = createApp();

                const {
                    browserWindow,
                    focusMock,
                    isFocusedMock,
                    isVisibleMock,
                    restoreMock,
                    showMock,
                    webContentsSendMock,
                } = createBrowserWindow({ isFocused: false, isVisible: true });

                new BrowserWindowToggler(operatingSystem, app, browserWindow).toggle();

                expect(isVisibleMock).toHaveBeenCalledOnce();
                expect(isFocusedMock).toHaveBeenCalledOnce();
                expect(appShowMock).toHaveBeenCalledOnce();

                if (operatingSystem === "Windows") {
                    expect(restoreMock).toHaveBeenCalledOnce();
                } else {
                    expect(restoreMock).not.toHaveBeenCalled();
                }

                expect(showMock).toHaveBeenCalledOnce();
                expect(focusMock).toHaveBeenCalledOnce();
                expect(webContentsSendMock).toHaveBeenCalledWith("windowFocused");
            };

            testShowAndFocus({ operatingSystem: "Windows" });
            testShowAndFocus({ operatingSystem: "macOS" });
            testShowAndFocus({ operatingSystem: "Linux" });
        });

        it("should show and focus the window if its hidden, re-centering it and resizing it to the default size", () => {
            const { app, showMock: appShowMock } = createApp();

            const { browserWindow, focusMock, isVisibleMock, restoreMock, showMock, webContentsSendMock } =
                createBrowserWindow({ isFocused: false, isVisible: false });

            new BrowserWindowToggler("Windows", app, browserWindow).toggle();

            expect(isVisibleMock).toHaveBeenCalledOnce();
            expect(appShowMock).toHaveBeenCalledOnce();
            expect(restoreMock).toHaveBeenCalledOnce();
            expect(showMock).toHaveBeenCalledOnce();
            expect(focusMock).toHaveBeenCalledOnce();
            expect(webContentsSendMock).toHaveBeenCalledWith("windowFocused");
        });

        it("should show and focus the window if its hidden, repositioning it with the given bounds", () => {
            const { app, showMock: appShowMock } = createApp();

            const { browserWindow, focusMock, isVisibleMock, restoreMock, showMock, webContentsSendMock } =
                createBrowserWindow({ isFocused: false, isVisible: false });

            new BrowserWindowToggler("Windows", app, browserWindow).toggle();

            expect(isVisibleMock).toHaveBeenCalledOnce();
            expect(appShowMock).toHaveBeenCalledOnce();
            expect(restoreMock).toHaveBeenCalledOnce();
            expect(showMock).toHaveBeenCalledOnce();
            expect(focusMock).toHaveBeenCalledOnce();
            expect(webContentsSendMock).toHaveBeenCalledWith("windowFocused");
        });

        it("should show and focus the window if its hidden", () => {
            const { app, showMock: appShowMock } = createApp();

            const { browserWindow, focusMock, isVisibleMock, restoreMock, showMock, webContentsSendMock } =
                createBrowserWindow({ isFocused: false, isVisible: false });

            new BrowserWindowToggler("Windows", app, browserWindow).toggle();

            expect(isVisibleMock).toHaveBeenCalledOnce();
            expect(appShowMock).toHaveBeenCalledOnce();
            expect(restoreMock).toHaveBeenCalledOnce();
            expect(showMock).toHaveBeenCalledOnce();
            expect(focusMock).toHaveBeenCalledOnce();
            expect(webContentsSendMock).toHaveBeenCalledWith("windowFocused");
        });

        it("should hide the window if it is visible and focussed", () => {
            const testHide = ({ operatingSystem }: { operatingSystem: OperatingSystem }) => {
                const { app, hideMock: appHideMock } = createApp();

                const { browserWindow, isVisibleMock, isFocusedMock, minimizeMock, hideMock } = createBrowserWindow({
                    isFocused: true,
                    isVisible: true,
                });

                new BrowserWindowToggler(operatingSystem, app, browserWindow).toggle();

                expect(isVisibleMock).toHaveBeenCalledOnce();
                expect(isFocusedMock).toHaveBeenCalledOnce();
                expect(appHideMock).toHaveBeenCalledOnce();

                if (operatingSystem === "Windows") {
                    expect(minimizeMock).toHaveBeenCalledOnce();
                } else {
                    expect(minimizeMock).not.toHaveBeenCalled();
                }

                expect(hideMock).toHaveBeenCalledOnce();
            };

            testHide({ operatingSystem: "Windows" });
            testHide({ operatingSystem: "macOS" });
            testHide({ operatingSystem: "Linux" });
        });
    });
});
