import type { SettingsManager } from "@Core/SettingsManager";
import type { Image } from "@common/Core/Image";
import type { UrlImageGenerator as UrlImageGeneratorInterface } from "./Contract";

export class UrlImageGenerator implements UrlImageGeneratorInterface {
    public constructor(private readonly settingsManager: SettingsManager) {}

    public getImage(url: string): Image {
        const { host } = new URL(url);
        const size = 48;

        const imageUrls: Record<string, () => string> = {
            Google: () => `https://www.google.com/s2/favicons?domain=${host}&sz=${size}`,
            Favicone: () => `https://favicone.com/${host}?s=${size}`,
        };

        return {
            url: Object.keys(imageUrls).includes(this.getFaviconApiProvider())
                ? imageUrls[this.getFaviconApiProvider()]()
                : imageUrls["Google"](),
        };
    }

    private getFaviconApiProvider(): string {
        return this.settingsManager.getValue("imageGenerator.faviconApiProvider", "Google");
    }
}
