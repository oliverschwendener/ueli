import type { SettingsManager } from "@Core/SettingsManager";
import type { OperatingSystem } from "@common/Core";
import type { App, BrowserWindow, Rectangle, Size } from "electron";
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
        it("should show and focus the window if its visible but not focused, recentering it and resizing it to the default size", () => {
            const testShowAndFocus = ({ operatingSystem }: { operatingSystem: OperatingSystem }) => {
                const { app, showMock: appShowMock } = createApp();

                const {
                    browserWindow,
                    centerMock,
                    focusMock,
                    isFocusedMock,
                    isVisibleMock,
                    restoreMock,
                    setBoundsMock,
                    showMock,
                    webContentsSendMock,
                } = createBrowserWindow({ isFocused: false, isVisible: true });

                const defaultSize = <Size>{ width: 100, height: 200 };
                const settingsManager = <SettingsManager>{};

                new BrowserWindowToggler(operatingSystem, app, browserWindow, defaultSize, settingsManager).toggle();

                expect(isVisibleMock).toHaveBeenCalledOnce();
                expect(isFocusedMock).toHaveBeenCalledOnce();
                expect(appShowMock).toHaveBeenCalledOnce();

                operatingSystem === "Windows"
                    ? expect(restoreMock).toHaveBeenCalledOnce()
                    : expect(restoreMock).not.toHaveBeenCalled();

                expect(showMock).toHaveBeenCalledOnce();
                expect(focusMock).toHaveBeenCalledOnce();
                expect(webContentsSendMock).toHaveBeenCalledWith("windowFocused");
                expect(setBoundsMock).toHaveBeenCalledWith(defaultSize);
                expect(centerMock).toHaveBeenCalledOnce();
            };

            testShowAndFocus({ operatingSystem: "Windows" });
            testShowAndFocus({ operatingSystem: "macOS" });
            testShowAndFocus({ operatingSystem: "Linux" });
        });

        it("should show and focus the window if its hidden, recentering it and resizing it to the default size", () => {
            const { app, showMock: appShowMock } = createApp();

            const {
                browserWindow,
                centerMock,
                focusMock,
                isVisibleMock,
                restoreMock,
                setBoundsMock,
                showMock,
                webContentsSendMock,
            } = createBrowserWindow({ isFocused: false, isVisible: false });

            const defaultSize = <Size>{ width: 100, height: 200 };
            const settingsManager = <SettingsManager>{};

            new BrowserWindowToggler("Windows", app, browserWindow, defaultSize, settingsManager).toggle();

            expect(isVisibleMock).toHaveBeenCalledOnce();
            expect(appShowMock).toHaveBeenCalledOnce();
            expect(restoreMock).toHaveBeenCalledOnce();
            expect(showMock).toHaveBeenCalledOnce();
            expect(focusMock).toHaveBeenCalledOnce();
            expect(webContentsSendMock).toHaveBeenCalledWith("windowFocused");
            expect(setBoundsMock).toHaveBeenCalledWith(defaultSize);
            expect(centerMock).toHaveBeenCalledOnce();
        });

        it("should show and focus the window if its hidden, repositioning it with the given bounds", () => {
            const { app, showMock: appShowMock } = createApp();

            const {
                browserWindow,
                focusMock,
                isVisibleMock,
                restoreMock,
                setBoundsMock,
                showMock,
                webContentsSendMock,
                centerMock,
            } = createBrowserWindow({ isFocused: false, isVisible: false });

            const defaultSize = <Size>{ width: 100, height: 200 };
            const bounds = <Rectangle>{ x: 10, y: 20, width: 30, height: 40 };

            const getValueMock = vi.fn().mockReturnValue(false);
            const settingsManager = <SettingsManager>{ getValue: (k, d) => getValueMock(k, d) };

            new BrowserWindowToggler("Windows", app, browserWindow, defaultSize, settingsManager).toggle(bounds);

            expect(isVisibleMock).toHaveBeenCalledOnce();
            expect(appShowMock).toHaveBeenCalledOnce();
            expect(restoreMock).toHaveBeenCalledOnce();
            expect(showMock).toHaveBeenCalledOnce();
            expect(focusMock).toHaveBeenCalledOnce();
            expect(webContentsSendMock).toHaveBeenCalledWith("windowFocused");
            expect(setBoundsMock).toHaveBeenCalledWith(bounds);
            expect(centerMock).not.toHaveBeenCalled();
        });

        it("should show and focus the window if its hidden, repositioning it with the given bounds and recentering it if alwaysCenter is set to true", () => {
            const { app, showMock: appShowMock } = createApp();

            const {
                browserWindow,
                centerMock,
                focusMock,
                isVisibleMock,
                restoreMock,
                setBoundsMock,
                showMock,
                webContentsSendMock,
            } = createBrowserWindow({ isFocused: false, isVisible: false });

            const defaultSize = <Size>{ width: 100, height: 200 };
            const bounds = <Rectangle>{ x: 10, y: 20, width: 30, height: 40 };

            const getValueMock = vi.fn().mockReturnValue(true);
            const settingsManager = <SettingsManager>{ getValue: (k, d) => getValueMock(k, d) };

            new BrowserWindowToggler("Windows", app, browserWindow, defaultSize, settingsManager).toggle(bounds);

            expect(isVisibleMock).toHaveBeenCalledOnce();
            expect(appShowMock).toHaveBeenCalledOnce();
            expect(restoreMock).toHaveBeenCalledOnce();
            expect(showMock).toHaveBeenCalledOnce();
            expect(focusMock).toHaveBeenCalledOnce();
            expect(webContentsSendMock).toHaveBeenCalledWith("windowFocused");
            expect(setBoundsMock).toHaveBeenCalledWith(bounds);
            expect(centerMock).toHaveBeenCalledOnce();
        });

        it("should hide the window if it is visible and focussed", () => {
            const testHide = ({ operatingSystem }: { operatingSystem: OperatingSystem }) => {
                const { app, hideMock: appHideMock } = createApp();

                const { browserWindow, isVisibleMock, isFocusedMock, minimizeMock, hideMock } = createBrowserWindow({
                    isFocused: true,
                    isVisible: true,
                });

                const defaultSize = <Size>{ width: 100, height: 200 };
                const settingsManager = <SettingsManager>{};

                new BrowserWindowToggler(operatingSystem, app, browserWindow, defaultSize, settingsManager).toggle();

                expect(isVisibleMock).toHaveBeenCalledOnce();
                expect(isFocusedMock).toHaveBeenCalledOnce();
                expect(appHideMock).toHaveBeenCalledOnce();

                operatingSystem === "Windows"
                    ? expect(minimizeMock).toHaveBeenCalledOnce()
                    : expect(minimizeMock).not.toHaveBeenCalled();

                expect(hideMock).toHaveBeenCalledOnce();
            };

            testHide({ operatingSystem: "Windows" });
            testHide({ operatingSystem: "macOS" });
            testHide({ operatingSystem: "Linux" });
        });
    });
});
