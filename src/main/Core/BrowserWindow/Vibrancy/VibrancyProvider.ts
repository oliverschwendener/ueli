import type { SettingsManager } from "@Core/SettingsManager";
import type { Vibrancy, BrowserWindowVibrancyProvider as VibrancyProviderInterface } from "../Contract";

export class VibrancyProvider implements VibrancyProviderInterface {
    public constructor(private readonly settingsManager: SettingsManager) {}

    public get(): Vibrancy | null {
        const vibrancy = this.settingsManager.getValue("window.vibrancy", "None") as string;

        const allowedValues: Vibrancy[] = [
            "content",
            "fullscreen-ui",
            "header",
            "hud",
            "menu",
            "popover",
            "selection",
            "sheet",
            "sidebar",
            "titlebar",
            "tooltip",
            "under-page",
            "under-window",
            "window",
        ];

        return allowedValues.includes(vibrancy as Vibrancy) ? (vibrancy as Vibrancy) : null;
    }
}
