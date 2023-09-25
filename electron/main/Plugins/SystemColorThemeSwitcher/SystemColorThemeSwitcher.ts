import type { OperatingSystem } from "@common/OperatingSystem";
import type { SearchResultItem } from "@common/SearchResultItem";
import type { UeliPlugin } from "@common/UeliPlugin";
import type { SearchIndex } from "../../SearchIndex";
import type { PluginDependencies } from "../PluginDependencies";

export class SystemColorThemeSwitcher implements UeliPlugin {
    public readonly id: string = "SystemColorThemeSwitcher";
    public readonly name: string = "SystemColorThemeSwitcher";
    public readonly nameTranslationKey: string = "plugin[SystemColorThemeSwitcher].pluginName";
    public readonly supportedOperatingSystems: OperatingSystem[] = ["Windows", "macOS"];

    private currentOperatingSystem: OperatingSystem;
    private searchIndex: SearchIndex;

    public setPluginDependencies(pluginDependencies: PluginDependencies): void {
        this.currentOperatingSystem = pluginDependencies.operatingSystem;
        this.searchIndex = pluginDependencies.searchIndex;
    }

    public async addSearchResultItemsToSearchIndex(): Promise<void> {
        this.searchIndex.addSearchResultItems(this.id, [
            SystemColorThemeSwitcher.getSearchResultItem({
                operatingSystem: this.currentOperatingSystem,
                switchToLightMode: true,
            }),
            SystemColorThemeSwitcher.getSearchResultItem({
                operatingSystem: this.currentOperatingSystem,
                switchToLightMode: false,
            }),
        ]);
    }

    private static getSearchResultItem({
        operatingSystem,
        switchToLightMode,
    }: {
        operatingSystem: OperatingSystem;
        switchToLightMode: boolean;
    }): SearchResultItem {
        return {
            description: "System",
            executionServiceArgument: SystemColorThemeSwitcher.getSearchResultItemExecutionServiceArgument({
                operatingSystem,
                switchToLightMode,
            }),
            executionServiceId: SystemColorThemeSwitcher.getSearchResultItemExecutionServiceId(operatingSystem),
            id: SystemColorThemeSwitcher.getSearchResultItemId(switchToLightMode),
            name: SystemColorThemeSwitcher.getSearchResultItemName(switchToLightMode),
            hideWindowAfterExecution: false,
            imageUrl: SystemColorThemeSwitcher.getSearchResultItemImageUrl(operatingSystem),
        };
    }

    private static getSearchResultItemImageUrl(operatingSystem: OperatingSystem): string {
        return operatingSystem === "Windows"
            ? "https://preview.redd.it/windows-11-logo-in-svg-format-v0-sudz5o3s1vn91.png?width=1080&format=png&auto=webp&s=196ef4f2bff864c6d3f58b074fa32479a285ab49"
            : "https://upload.wikimedia.org/wikipedia/en/thumb/2/23/System_Preferences_icon.png/120px-System_Preferences_icon.png";
    }

    private static getSearchResultItemExecutionServiceId(operatingSystem: OperatingSystem): string {
        return operatingSystem === "Windows" ? "Powershell" : "Commandline";
    }

    private static getSearchResultItemName(switchToLightMode: boolean): string {
        const suffix = switchToLightMode ? "light mode" : "dark mode";

        return `Switch to ${suffix}`;
    }

    private static getSearchResultItemId(switchToLightMode: boolean): string {
        const suffix = switchToLightMode ? "switchToLightMode" : "switchToDarkMode";

        return `OperatingSystemColorThemeSwitcher:${suffix}`;
    }

    private static getSearchResultItemExecutionServiceArgument({
        operatingSystem,
        switchToLightMode,
    }: {
        operatingSystem: OperatingSystem;
        switchToLightMode: boolean;
    }): string {
        const windowsRegistryPath = "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize";
        const windowsRegistryValue = switchToLightMode ? "1" : "0";
        const windowsExecutionServiceArgument = [
            `Set-ItemProperty -Path ${windowsRegistryPath} -Name SystemUsesLightTheme -Value ${windowsRegistryValue}`,
            `Set-ItemProperty -Path ${windowsRegistryPath} -Name AppsUseLightTheme -Value ${windowsRegistryValue}`,
        ].join("; ");

        const osaScriptValue = switchToLightMode ? "false" : "true";
        const macOsExecutionServiceArgument = `osascript -e 'tell app "System Events" to tell appearance preferences to set dark mode to ${osaScriptValue}'`;

        const result: Record<OperatingSystem, string> = {
            Windows: windowsExecutionServiceArgument,
            macOS: macOsExecutionServiceArgument,
        };

        return result[operatingSystem];
    }
}
