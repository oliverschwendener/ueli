import type { SettingsManager } from "@Core/SettingsManager";
import type { Image } from "@common/Core/Image";
import type { UrlImageGenerator as UrlImageGeneratorInterface } from "./Contract";

export class UrlImageGenerator implements UrlImageGeneratorInterface {
    public constructor(private readonly settingsManager: SettingsManager) {}

    public getImage(url: string): Image {
        const { host } = new URL(url);
        const size = 48;

        const faviconProviders: Record<string, () => string> = {
            Google: () => `https://www.google.com/s2/favicons?domain=${host}&sz=${size}`,
            Favicone: () => `https://favicone.com/${host}?s=${size}`,
            DuckDuckGo: () => `https://icons.duckduckgo.com/ip3/${host}.ico`,
        };

        return {
            url: Object.keys(faviconProviders).includes(this.getFaviconApiProvider())
                ? faviconProviders[this.getFaviconApiProvider()]()
                : faviconProviders["Google"](),
        };
    }

    private getFaviconApiProvider(): string {
        return this.settingsManager.getValue("imageGenerator.faviconApiProvider", "Google");
    }
}
