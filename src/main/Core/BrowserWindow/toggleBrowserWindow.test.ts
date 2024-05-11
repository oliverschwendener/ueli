import type { App, BrowserWindow, Rectangle, Size } from "electron";
import { describe, expect, it, vi } from "vitest";
import { toggleBrowserWindow } from "./toggleBrowserWindow";

describe(toggleBrowserWindow, () => {
    describe("toggleBrowserWindow", () => {
        const testToggleBrowserWindow = ({
            app,
            browserWindow,
            expectations,
        }: {
            app: App;
            browserWindow: BrowserWindow;
            expectations: (() => void)[];
        }) => {
            toggleBrowserWindow({
                app,
                browserWindow,
                alwaysCenter: false,
                defaultSize: { width: 0, height: 0 },
            });

            for (const expectation of expectations) {
                expectation();
            }
        };

        it("should show and focus the window if its visible but not focused", () => {
            const appShowMock = vi.fn();
            const setBoundsMock = vi.fn();
            const centerMock = vi.fn();
            const showMock = vi.fn();
            const focusMock = vi.fn();
            const webContentsSendMock = vi.fn();

            testToggleBrowserWindow({
                app: <App>{ show: () => appShowMock() },
                browserWindow: <BrowserWindow>{
                    isVisible: () => true,
                    isFocused: () => false,
                    setBounds: (b) => setBoundsMock(b),
                    center: () => centerMock(),
                    show: () => showMock(),
                    focus: () => focusMock(),
                    webContents: { send: (c) => webContentsSendMock(c) },
                },
                expectations: [
                    () => expect(appShowMock).toHaveBeenCalledOnce(),
                    () => expect(showMock).toHaveBeenCalledOnce(),
                    () => expect(focusMock).toHaveBeenCalledOnce(),
                    () => expect(webContentsSendMock).toHaveBeenCalledWith("windowFocused"),
                ],
            });
        });

        it("should show and focus the window if its hidden", () => {
            const setBoundsMock = vi.fn();
            const centerMock = vi.fn();
            const showMock = vi.fn();
            const focusMock = vi.fn();
            const webContentsSendMock = vi.fn();

            testToggleBrowserWindow({
                app: <App>{},
                browserWindow: <BrowserWindow>{
                    isVisible: () => false,
                    setBounds: (b) => setBoundsMock(b),
                    center: () => centerMock(),
                    show: () => showMock(),
                    focus: () => focusMock(),
                    webContents: { send: (c) => webContentsSendMock(c) },
                },
                expectations: [
                    () => expect(showMock).toHaveBeenCalledOnce(),
                    () => expect(focusMock).toHaveBeenCalledOnce(),
                    () => expect(webContentsSendMock).toHaveBeenCalledWith("windowFocused"),
                ],
            });
        });

        it("should hide the window if it is visible and focussed", () => {
            const hideMock = vi.fn();

            testToggleBrowserWindow({
                app: <App>{},
                browserWindow: <BrowserWindow>{
                    isVisible: () => true,
                    isFocused: () => true,
                    hide: () => hideMock(),
                },
                expectations: [() => expect(hideMock).toHaveBeenCalledOnce()],
            });
        });
    });

    describe("repositionWindow", () => {
        const testRepositionWindow = ({
            alwaysCenter,
            defaultSize,
            resizeTo,
            bounds,
            expectRecenter,
        }: {
            alwaysCenter: boolean;
            defaultSize: Size;
            resizeTo: Size | Rectangle;
            bounds: Rectangle;
            expectRecenter: boolean;
        }) => {
            const setBounds = vi.fn();
            const center = vi.fn();
            const show = vi.fn();
            const focus = vi.fn();
            const send = vi.fn();

            toggleBrowserWindow({
                app: <App>{},
                browserWindow: <BrowserWindow>{
                    isVisible: () => false,
                    setBounds: (b) => setBounds(b),
                    center: () => center(),
                    show: () => show(),
                    focus: () => focus(),
                    webContents: { send: (c) => send(c) },
                },
                alwaysCenter,
                defaultSize,
                bounds,
            });

            if (expectRecenter) {
                expect(center).toHaveBeenCalledOnce();
            }

            expect(setBounds).toHaveBeenCalledWith(resizeTo);
        };

        it("should reposition the window with the given bounds", () =>
            testRepositionWindow({
                alwaysCenter: false,
                defaultSize: { width: 0, height: 0 },
                resizeTo: { x: 0, y: 0, width: 1, height: 1 },
                bounds: { x: 0, y: 0, width: 1, height: 1 },
                expectRecenter: false,
            }));

        it("should reposition the window with the default size when no bounds given", () =>
            testRepositionWindow({
                alwaysCenter: false,
                defaultSize: { width: 0, height: 0 },
                resizeTo: { height: 0, width: 0 },
                bounds: undefined,
                expectRecenter: false,
            }));

        it("should re-center the window when no bounds given", () =>
            testRepositionWindow({
                alwaysCenter: false,
                defaultSize: { width: 0, height: 0 },
                resizeTo: { height: 0, width: 0 },
                bounds: undefined,
                expectRecenter: true,
            }));

        it("should re-center the window when alwaysCenter is set to true", () =>
            testRepositionWindow({
                alwaysCenter: true,
                defaultSize: { width: 0, height: 0 },
                resizeTo: { x: 0, y: 0, width: 1, height: 1 },
                bounds: { x: 0, y: 0, width: 1, height: 1 },
                expectRecenter: true,
            }));
    });
});
