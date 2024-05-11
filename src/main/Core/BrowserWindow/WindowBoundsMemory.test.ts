import type { BrowserWindow, Point, Rectangle, Screen } from "electron";
import { describe, expect, it, vi } from "vitest";
import { WindowBoundsMemory } from "./WindowBoundsMemory";

describe(WindowBoundsMemory, () => {
    it("should return the window bounds of the current screen if available", () => {
        const screenPoint = <Point>{ x: 0, y: 0 };

        const getDisplayNearestPointMock = vi.fn().mockReturnValue({ id: 1 });
        const getCursorScreenPointMock = vi.fn().mockReturnValue(screenPoint);

        const screen = <Screen>{
            getDisplayNearestPoint: (p) => getDisplayNearestPointMock(p),
            getCursorScreenPoint: () => getCursorScreenPointMock(),
        };

        const boundsDisplay0 = <Rectangle>{ x: 0, y: 0, width: 100, height: 100 };
        const boundsDisplay1 = <Rectangle>{ x: 100, y: 100, width: 100, height: 100 };
        const boundsDisplay2 = <Rectangle>{ x: 200, y: 200, width: 100, height: 100 };

        const windowBoundsMemory = new WindowBoundsMemory(screen, {
            "display[0]": boundsDisplay0,
            "display[1]": boundsDisplay1,
            "display[2]": boundsDisplay2,
        });

        expect(windowBoundsMemory.getBoundsNearestToCursor()).toEqual(boundsDisplay1);
        expect(getCursorScreenPointMock).toHaveBeenCalledOnce();
        expect(getDisplayNearestPointMock).toHaveBeenCalledWith(screenPoint);
    });

    it("should return undefined if no bounds are available for the current screen", () => {
        const screenPoint = <Point>{ x: 0, y: 0 };

        const getDisplayNearestPointMock = vi.fn().mockReturnValue({ id: 1 });
        const getCursorScreenPointMock = vi.fn().mockReturnValue(screenPoint);

        const screen = <Screen>{
            getDisplayNearestPoint: (p) => getDisplayNearestPointMock(p),
            getCursorScreenPoint: () => getCursorScreenPointMock(),
        };

        const windowBoundsMemory = new WindowBoundsMemory(screen, {
            "display[0]": <Rectangle>{ x: 0, y: 0, width: 100, height: 100 },
            "display[2]": <Rectangle>{ x: 200, y: 200, width: 100, height: 100 },
        });

        expect(windowBoundsMemory.getBoundsNearestToCursor()).toBeUndefined();
        expect(getCursorScreenPointMock).toHaveBeenCalledOnce();
        expect(getDisplayNearestPointMock).toHaveBeenCalledWith(screenPoint);
    });

    it("should save the window bounds for the current screen", () => {
        const getDisplayNearestPointMock = vi.fn().mockReturnValue({ id: 1138 });

        const screen = <Screen>{ getDisplayNearestPoint: (p) => getDisplayNearestPointMock(p) };

        const windowBounds = <Rectangle>{ x: 100, y: 100, width: 100, height: 100 };

        const memory = {};

        new WindowBoundsMemory(screen, memory).saveWindowBounds(<BrowserWindow>{ getBounds: () => windowBounds });

        expect(memory).toEqual({ "display[1138]": windowBounds });
    });
});
