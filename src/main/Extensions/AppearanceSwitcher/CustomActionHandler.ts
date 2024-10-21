import type { ActionHandler } from "@Core/ActionHandler";
import type { AppleScriptUtility } from "@Core/AppleScriptUtility";
import type { PowershellUtility } from "@Core/PowershellUtility";
import type { OperatingSystem, SearchResultItemAction } from "@common/Core";
import type { NativeTheme } from "electron";
import type { SwitchTo } from "./SwitchTo";

export class CustomActionHandler implements ActionHandler {
    public readonly id = "AppearanceSwitcher";

    private readonly togglers: Record<OperatingSystem, (switchTo: SwitchTo) => Promise<void>> = {
        Linux: async () => {}, // not supported
        macOS: async (s) => await this.toggleMacOsSystemAppearance(s),
        Windows: async (s) => await this.toggleWindowsSystemAppearance(s),
    };

    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly powershellUtility: PowershellUtility,
        private readonly appleScriptUtility: AppleScriptUtility,
        private readonly nativeTheme: NativeTheme,
    ) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        if (action.argument !== "toggle") {
            throw new Error(`Argument "${action.argument}" is not supported`);
        }

        await this.togglers[this.operatingSystem](this.nativeTheme.shouldUseDarkColors ? "light" : "dark");
    }

    private async toggleWindowsSystemAppearance(to: SwitchTo) {
        const windowsRegistryPath = "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize";
        const windowsRegistryValue = to === "light" ? "1" : "0";

        const powershellCommands = [
            `Set-ItemProperty -Path ${windowsRegistryPath} -Name SystemUsesLightTheme -Value ${windowsRegistryValue}`,
            `Set-ItemProperty -Path ${windowsRegistryPath} -Name AppsUseLightTheme -Value ${windowsRegistryValue}`,
        ];

        await this.powershellUtility.executeCommand(powershellCommands.join(";"));
    }

    private async toggleMacOsSystemAppearance(to: SwitchTo) {
        const osaScriptValue = to === "light" ? "false" : "true";

        await this.appleScriptUtility.executeAppleScript(
            `tell app "System Events" to tell appearance preferences to set dark mode to ${osaScriptValue}`,
        );
    }
}
