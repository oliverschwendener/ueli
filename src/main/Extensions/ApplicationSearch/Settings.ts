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
            // Linux only is able to launch applications files stored in these directories
            linuxApplicationFolders: [
                "/usr/share/applications",
                join(this.app.getPath("home"), ".local", "share", "applications"),
            ],
            linuxFileExtensions: [".desktop"],
            // https://specifications.freedesktop.org/icon-theme-spec/latest/ar01s03.html
            linuxBaseSearchDirectories: [
                join(this.app.getPath("home"), ".icons"),
                join(process.env["XDG_DATA_HOME"] || join(this.app.getPath("home"), ".local", "share"), "icons"),
                ...(
                    process.env["XDG_DATA_DIRS"] || `${join("/", "usr", "local", "share")}:${join("/", "usr", "share")}`
                )
                    .split(":")
                    .map((dir) => join(dir, "icons")),
                join("/", "usr", "share", "pixmaps"),
            ],
        };

        return defaultValues[key] as T;
    }
}
