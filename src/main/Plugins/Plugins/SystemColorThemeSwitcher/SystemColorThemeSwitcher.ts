import type { OperatingSystem } from "@common/OperatingSystem";
import type { SearchResultItem } from "@common/SearchResultItem";
import type { UeliPlugin } from "@common/UeliPlugin";

export class SystemColorThemeSwitcher implements UeliPlugin {
    public readonly id: string = "SystemColorThemeSwitcher";
    public readonly name: string = "SystemColorThemeSwitcher";
    public readonly nameTranslationKey: string = "plugin[SystemColorThemeSwitcher].pluginName";
    public readonly supportedOperatingSystems: OperatingSystem[] = ["Windows", "macOS"];

    public constructor(private readonly currentOperatingSystem: OperatingSystem) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        return [
            this.getSearchResultItem({ switchToLightMode: true }),
            this.getSearchResultItem({ switchToLightMode: false }),
        ];
    }

    private getSearchResultItem({ switchToLightMode }: { switchToLightMode: boolean }): SearchResultItem {
        return {
            description: "System",
            executionServiceArgument: this.getSearchResultItemExecutionServiceArgument(switchToLightMode),
            executionServiceId: this.getSearchResultItemExecutionServiceId(),
            id: SystemColorThemeSwitcher.getSearchResultItemId(switchToLightMode),
            name: SystemColorThemeSwitcher.getSearchResultItemName(switchToLightMode),
            hideWindowAfterExecution: false,
            imageUrl: this.getSearchResultItemImageUrl(),
        };
    }

    private getSearchResultItemImageUrl(): string {
        return {
            macOS: "https://upload.wikimedia.org/wikipedia/en/thumb/2/23/System_Preferences_icon.png/120px-System_Preferences_icon.png",
            Windows:
                "https://preview.redd.it/windows-11-logo-in-svg-format-v0-sudz5o3s1vn91.png?width=1080&format=png&auto=webp&s=196ef4f2bff864c6d3f58b074fa32479a285ab49",
        }[this.currentOperatingSystem];
    }

    private getSearchResultItemExecutionServiceId(): string {
        return {
            macOS: "Commandline",
            Windows: "Powershell",
        }[this.currentOperatingSystem];
    }

    private static getSearchResultItemName(switchToLightMode: boolean): string {
        const suffix = switchToLightMode ? "light mode" : "dark mode";

        return `Switch to ${suffix}`;
    }

    private static getSearchResultItemId(switchToLightMode: boolean): string {
        const suffix = switchToLightMode ? "switchToLightMode" : "switchToDarkMode";

        return `OperatingSystemColorThemeSwitcher:${suffix}`;
    }

    private getSearchResultItemExecutionServiceArgument(switchToLightMode: boolean): string {
        const windowsRegistryPath = "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize";
        const windowsRegistryValue = switchToLightMode ? "1" : "0";
        const windowsExecutionServiceArgument = [
            `Set-ItemProperty -Path ${windowsRegistryPath} -Name SystemUsesLightTheme -Value ${windowsRegistryValue}`,
            `Set-ItemProperty -Path ${windowsRegistryPath} -Name AppsUseLightTheme -Value ${windowsRegistryValue}`,
        ].join("; ");

        const osaScriptValue = switchToLightMode ? "false" : "true";
        const macOsExecutionServiceArgument = `osascript -e 'tell app "System Events" to tell appearance preferences to set dark mode to ${osaScriptValue}'`;

        return {
            Windows: windowsExecutionServiceArgument,
            macOS: macOsExecutionServiceArgument,
        }[this.currentOperatingSystem];
    }
}
