import { describe, expect, it } from "vitest";
import { getVibrancy } from "./getVibrancy";

describe(getVibrancy, () => {
    it("should return the correct vibrancy", () => {
        expect(getVibrancy("content")).toEqual("content");
        expect(getVibrancy("fullscreen-ui")).toEqual("fullscreen-ui");
        expect(getVibrancy("header")).toEqual("header");
        expect(getVibrancy("hud")).toEqual("hud");
        expect(getVibrancy("menu")).toEqual("menu");
        expect(getVibrancy("popover")).toEqual("popover");
        expect(getVibrancy("selection")).toEqual("selection");
        expect(getVibrancy("sheet")).toEqual("sheet");
        expect(getVibrancy("sidebar")).toEqual("sidebar");
        expect(getVibrancy("titlebar")).toEqual("titlebar");
        expect(getVibrancy("tooltip")).toEqual("tooltip");
        expect(getVibrancy("under-page")).toEqual("under-page");
        expect(getVibrancy("under-window")).toEqual("under-window");
        expect(getVibrancy("window")).toEqual("window");
        expect(getVibrancy("")).toEqual(null);
        expect(getVibrancy(" ")).toEqual(null);
        expect(getVibrancy("Window")).toEqual(null);
    });
});
