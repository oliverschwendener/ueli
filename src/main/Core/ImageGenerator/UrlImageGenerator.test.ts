import type { SettingsManager } from "@Core/SettingsManager";
import type { Image } from "@common/Core/Image";
import { describe, expect, it, vi } from "vitest";
import { UrlImageGenerator } from "./UrlImageGenerator";

describe(UrlImageGenerator, () => {
    it("should generate correct favicon urls using the Google favicon provider", () => {
        const getValueMock = vi.fn().mockReturnValue("Google");
        const settingsManager = <SettingsManager>{ getValue: (k, d) => getValueMock(k, d) };

        const urlImageGenerator = new UrlImageGenerator(settingsManager);

        expect(urlImageGenerator.getImage("https://github.com")).toEqual(<Image>{
            url: "https://www.google.com/s2/favicons?domain=github.com&sz=48",
        });

        expect(getValueMock).toHaveBeenCalledWith("imageGenerator.faviconApiProvider", "Google");
    });

    it("should generate correct favicon urls using the Favicone favicon provider", () => {
        const getValueMock = vi.fn().mockReturnValue("Favicone");
        const settingsManager = <SettingsManager>{ getValue: (k, d) => getValueMock(k, d) };

        const urlImageGenerator = new UrlImageGenerator(settingsManager);

        expect(urlImageGenerator.getImage("https://github.com")).toEqual(<Image>{
            url: "https://favicone.com/github.com?s=48",
        });

        expect(getValueMock).toHaveBeenCalledWith("imageGenerator.faviconApiProvider", "Google");
    });

    it("should use the Google API when the configured provider is invalid", () => {
        const getValueMock = vi.fn().mockReturnValue("Invalid");
        const settingsManager = <SettingsManager>{ getValue: (k, d) => getValueMock(k, d) };

        const urlImageGenerator = new UrlImageGenerator(settingsManager);

        expect(urlImageGenerator.getImage("https://github.com")).toEqual(<Image>{
            url: "https://www.google.com/s2/favicons?domain=github.com&sz=48",
        });

        expect(getValueMock).toHaveBeenCalledWith("imageGenerator.faviconApiProvider", "Google");
    });
});
