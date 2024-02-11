import type { SettingsManager } from "@Core/SettingsManager";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { App } from "electron";
import { join } from "path";

export class Settings {
    public constructor(
        private readonly extensionId: string,
        private readonly settingsManager: SettingsManager,
        private readonly app: App,
    ) {}

    public getValue<T>(key: string): T {
        return this.settingsManager.getValue<T>(
            getExtensionSettingKey(this.extensionId, key),
            this.getDefaultValue<T>(key),
        );
    }

    public getDefaultValue<T>(key: string): T {
        const defaultValues: Record<string, unknown> = {
            macOsFolders: [
                "/System/Applications",
                "/System/Library/CoreServices",
                "/Applications",
                join(this.app.getPath("home"), "Applications"),
            ],
            includeWindowsStoreApps: true,
            windowsFileExtensions: ["lnk"],
            windowsFolders: [
                "C:\\ProgramData\\Microsoft\\Windows\\Start Menu",
                join(this.app.getPath("home"), "AppData", "Roaming", "Microsoft", "Windows", "Start Menu"),
            ],
        };

        return defaultValues[key] as T;
    }
}
