import type { OperatingSystem } from "@common/OperatingSystem";
import type { SearchResultItem } from "@common/SearchResultItem";
import type { UeliPlugin } from "@common/UeliPlugin";
import type { PluginDependencies } from "../PluginDependencies";

export class WindowsColorThemeSwitcher implements UeliPlugin {
    public readonly id: string = "WindowsColorThemeSwitcher";
    public readonly name: string = "WindowsColorThemeSwitcher";
    public readonly nameTranslationKey: string = "plugin[WindowsColorThemeSwitcher].pluginName";
    public readonly supportedOperatingSystems: OperatingSystem[] = ["Windows"];

    public constructor(private readonly pluginDependencies: PluginDependencies) {}

    public async addSearchResultItemsToSearchIndex(): Promise<void> {
        const { searchIndex } = this.pluginDependencies;

        searchIndex.addSearchResultItems(this.id, [
            WindowsColorThemeSwitcher.getSearchResultItem(true),
            WindowsColorThemeSwitcher.getSearchResultItem(false),
        ]);
    }

    private static getSearchResultItem(switchToLightMode: boolean): SearchResultItem {
        return {
            description: "Windows Color Theme",
            executionServiceArgument: WindowsColorThemeSwitcher.getPowershellCommands(switchToLightMode),
            executionServiceId: "Powershell",
            id: WindowsColorThemeSwitcher.getSearchResultItemId(switchToLightMode),
            name: WindowsColorThemeSwitcher.getSearchResultItemName(switchToLightMode),
            hideWindowAfterExecution: false,
            imageUrl:
                "https://preview.redd.it/windows-11-logo-in-svg-format-v0-sudz5o3s1vn91.png?width=1080&format=png&auto=webp&s=196ef4f2bff864c6d3f58b074fa32479a285ab49",
        };
    }

    private static getSearchResultItemName(switchToLightMode: boolean): string {
        const suffix = switchToLightMode ? "light mode" : "dark mode";

        return `Windows: switch to ${suffix}`;
    }

    private static getSearchResultItemId(switchToLightMode: boolean): string {
        const suffix = switchToLightMode ? "switchToLightMode" : "switchToDarkMode";

        return `WindowsColorThemeSwitcher:${suffix}`;
    }

    private static getPowershellCommands(switchToLightMode: boolean): string {
        const windowsRegistryPath = "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize";
        const value = switchToLightMode ? "1" : "0";

        return [
            `Set-ItemProperty -Path ${windowsRegistryPath} -Name SystemUsesLightTheme -Value ${value}`,
            `Set-ItemProperty -Path ${windowsRegistryPath} -Name AppsUseLightTheme -Value ${value}`,
        ].join("; ");
    }
}
