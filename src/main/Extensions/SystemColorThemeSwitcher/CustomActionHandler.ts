import type { ActionHandler } from "@Core/ActionHandler";
import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { OperatingSystem, SearchResultItemAction } from "@common/Core";
import type { NativeTheme } from "electron";

export class CustomActionHandler implements ActionHandler {
    public readonly id = "SystemColorThemeSwitcher";

    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly commandlineUtility: CommandlineUtility,
        private readonly nativeTheme: NativeTheme,
    ) {}

    public invokeAction(action: SearchResultItemAction): Promise<void> {
        if (action.argument !== "toggle") {
            throw new Error(`Argument "${action.argument}" is not supported`);
        }

        const switchTo = this.nativeTheme.shouldUseDarkColors ? "light" : "dark";

        if (this.operatingSystem === "Windows") {
            return this.toggleWindowsSystemColor(switchTo);
        }

        if (this.operatingSystem === "macOS") {
            return this.toggleMacOsSystemAppearance(switchTo);
        }

        throw new Error(`Operating system "${this.operatingSystem} not supported"`);
    }

    private async toggleWindowsSystemColor(to: "dark" | "light") {
        const windowsRegistryPath = "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize";
        const windowsRegistryValue = to === "light" ? "1" : "0";

        const powershellCommands = [
            `Set-ItemProperty -Path ${windowsRegistryPath} -Name SystemUsesLightTheme -Value ${windowsRegistryValue}`,
            `Set-ItemProperty -Path ${windowsRegistryPath} -Name AppsUseLightTheme -Value ${windowsRegistryValue}`,
        ].join("; ");

        await this.commandlineUtility.executeCommand(`powershell -Command "& {${powershellCommands}}"`);
    }

    private async toggleMacOsSystemAppearance(to: "dark" | "light") {
        const osaScriptValue = to === "light" ? "false" : "true";

        await this.commandlineUtility.executeCommand(
            `osascript -e 'tell app "System Events" to tell appearance preferences to set dark mode to ${osaScriptValue}'`,
        );
    }
}
