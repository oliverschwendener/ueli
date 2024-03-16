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
            // This is hardcoded for the Linux DEs tested, DO NOT CHANGE
            // `gtk-launch` can only launch in these directories
            linuxFolders: (
                process.env["XDG_DATA_DIRS"] || `${join("/", "usr", "local", "share")}:${join("/", "usr", "share")}`
            )
                .split(":")
                .map((dir) => join(dir, "applications")),
            linuxFileExtensions: [".desktop"],
        };

        return defaultValues[key] as T;
    }
}
