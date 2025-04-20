import type { SettingsManager } from "@Core/SettingsManager";
import type { Image } from "@common/Core/Image";
import type { UrlImageGenerator as UrlImageGeneratorInterface } from "./Contract";
import type { FaviconProvider } from "./FaviconProvider";

export class UrlImageGenerator implements UrlImageGeneratorInterface {
    public constructor(
        private readonly settingsManager: SettingsManager,
        private readonly faviconProviders: Record<string, FaviconProvider>,
    ) {}

    public getImage(url: string): Image {
        const { host } = new URL(url);
        const size = 48;

        const providerName = this.getProviderName();

        const provider = Object.keys(this.faviconProviders).includes(providerName)
            ? this.faviconProviders[providerName]
            : this.faviconProviders["Google"];

        return { url: provider.getUrl(host, size) };
    }

    private getProviderName(): string {
        return this.settingsManager.getValue("imageGenerator.faviconApiProvider", "Google");
    }
}
