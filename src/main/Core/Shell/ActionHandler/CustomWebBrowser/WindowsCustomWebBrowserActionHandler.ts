import type { PowershellUtility } from "@Core/PowershellUtility";
import type { SettingsManager } from "@Core/SettingsManager";
import type { CustomWebBrowserActionHandler } from "./CustomWebBrowserActionHandler";

export class WindowsCustomWebBrowserActionHandler implements CustomWebBrowserActionHandler {
    public constructor(
        private readonly powershellUtility: PowershellUtility,
        private readonly settingsManager: SettingsManager,
    ) {}

    public isEnabled(): boolean {
        if (this.settingsManager.getValue<boolean>("general.browser.useDefaultWebBrowser", true)) {
            return false;
        }

        return this.getExecutableFilePath().length > 0 && this.getCommandlineArguments().includes("{{url}}");
    }

    public async openUrl(url: string): Promise<void> {
        await this.powershellUtility.executeCommand(
            `Start-Process -FilePath '${this.getExecutableFilePath()}' -ArgumentList '${this.getCommandlineArguments().replace("{{url}}", url)}'`,
        );
    }

    private getExecutableFilePath(): string {
        return this.settingsManager.getValue<string>("general.browser.customWebBrowser.executableFilePath", "");
    }

    private getCommandlineArguments(): string {
        return this.settingsManager.getValue<string>(
            "general.browser.customWebBrowser.commandlineArguments",
            "{{url}}",
        );
    }
}
