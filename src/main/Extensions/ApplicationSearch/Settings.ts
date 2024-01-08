import type { App } from "electron";
import { join } from "path";
import type { SettingsManager } from "../../SettingsManager";
import type { SettingKey } from "./SettingKey";

export class Settings {
    public constructor(
        private readonly extensionId: string,
        private readonly settingsManager: SettingsManager,
        private readonly app: App,
    ) {}

    public getValue<T>(key: SettingKey): T {
        return this.settingsManager.getExtensionSettingByKey<T>(this.extensionId, key, this.getDefaultValue(key));
    }

    public getDefaultValue<T>(key: SettingKey): T {
        const defaultValues: Record<SettingKey, unknown> = {
            macOsFolders: [
                "/System/Applications",
                "/System/Library/CoreServices",
                "/Applications",
                join(this.app.getPath("home"), "Applications"),
            ],
            windowsFileExtensions: ["lnk"],
            windowsFolders: [
                "C:\\ProgramData\\Microsoft\\Windows\\Start Menu",
                join(this.app.getPath("home"), "AppData", "Roaming", "Microsoft", "Windows", "Start Menu"),
            ],
        };

        return defaultValues[key] as T;
    }
}
