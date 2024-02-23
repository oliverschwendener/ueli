import { describe, expect, it } from "vitest";
import { getImageUrl } from "./getImageUrl";

describe(getImageUrl, () => {
    it("on dark background should return the url for the dark background if available", () => {
        expect(
            getImageUrl({
                image: { url: "neutral", urlOnDarkBackground: "dark", urlOnLightBackground: "light" },
                shouldPreferDarkColors: true,
            }),
        ).toBe("dark");
    });

    it("on light background should return the url for the light background if available", () => {
        expect(
            getImageUrl({
                image: { url: "neutral", urlOnDarkBackground: "dark", urlOnLightBackground: "light" },
                shouldPreferDarkColors: false,
            }),
        ).toBe("light");
    });

    it("on dark background should return the neutral url when dark is not available", () => {
        expect(
            getImageUrl({
                image: { url: "neutral", urlOnLightBackground: "light" },
                shouldPreferDarkColors: true,
            }),
        ).toBe("neutral");
    });

    it("on light background should return the neutral url when light is not available", () => {
        expect(
            getImageUrl({
                image: { url: "neutral", urlOnDarkBackground: "dark" },
                shouldPreferDarkColors: false,
            }),
        ).toBe("neutral");
    });
});
