import type { SettingsManager } from "@Core/SettingsManager";
import { describe, expect, it, vi } from "vitest";
import { UrlImageGenerator } from "./UrlImageGenerator";

describe(UrlImageGenerator, () => {
    it("should use the configured provider if its found", () => {
        const getValueMock = vi.fn().mockReturnValue("b");

        const settingsManager = <SettingsManager>{
            getValue: (k, d, s) => getValueMock(k, d, s),
        };

        const urlImageGenerator = new UrlImageGenerator(settingsManager, {
            a: { getUrl: () => "url_a" },
            b: { getUrl: () => "url_b" },
            c: { getUrl: () => "url_c" },
            Google: { getUrl: () => "url_google" },
        });

        expect(urlImageGenerator.getImage("https://example.com")).toEqual({ url: "url_b" });
    });

    it("should use the google provider if the configured provider is not found", () => {
        const getValueMock = vi.fn().mockReturnValue("d");

        const settingsManager = <SettingsManager>{
            getValue: (k, d, s) => getValueMock(k, d, s),
        };

        const urlImageGenerator = new UrlImageGenerator(settingsManager, {
            a: { getUrl: () => "url_a" },
            b: { getUrl: () => "url_b" },
            c: { getUrl: () => "url_c" },
            Google: { getUrl: () => "url_google" },
        });

        expect(urlImageGenerator.getImage("https://example.com")).toEqual({ url: "url_google" });
    });
});
