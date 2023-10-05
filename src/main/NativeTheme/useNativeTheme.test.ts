import type { IpcMain, IpcMainEvent, NativeTheme } from "electron";
import { describe, expect, it, vi } from "vitest";
import { useNativeTheme } from "./useNativeTheme";

describe(useNativeTheme, () => {
    it("should subscribe to ipcMain events", () => {
        const onMock = vi.fn();

        const ipcMain = <IpcMain>{
            on: (channel, listener) => onMock(channel, listener),
        };

        const nativeTheme = <NativeTheme>{
            shouldUseDarkColors: false,
        };

        useNativeTheme({ ipcMain, nativeTheme });

        const expectedListener = (event: IpcMainEvent) => (event.returnValue = nativeTheme.shouldUseDarkColors);

        expect(onMock).toHaveBeenCalledWith("themeShouldUseDarkColors", expect.any(Function));
        expect(onMock.mock.calls[0][1].toString()).toEqual(expectedListener.toString());
    });
});
