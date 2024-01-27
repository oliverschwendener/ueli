import { describe, expect, it } from "vitest";
import { getBackgroundMaterial } from "./getBackgroundMaterial";

describe(getBackgroundMaterial, () => {
    it("should return the correct background material", () => {
        expect(getBackgroundMaterial("Acrylic")).toEqual("acrylic");
        expect(getBackgroundMaterial("Mica")).toEqual("mica");
        expect(getBackgroundMaterial("Tabbed")).toEqual("tabbed");
        expect(getBackgroundMaterial("None")).toEqual("none");
        expect(getBackgroundMaterial("")).toEqual("mica");
        expect(getBackgroundMaterial("acrylic")).toEqual("mica");
        expect(getBackgroundMaterial("mica")).toEqual("mica");
        expect(getBackgroundMaterial("tabbed")).toEqual("mica");
        expect(getBackgroundMaterial("auto")).toEqual("mica");
    });
});
