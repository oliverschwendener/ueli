import type { EnvironmentVariableProvider } from "@Core/EnvironmentVariableProvider";
import type { SettingsManager } from "@Core/SettingsManager";
import { getExtensionSettingKey } from "@common/Core/Extension";
import type { App } from "electron";
import { join } from "path";

export class Settings {
    public constructor(
        private readonly extensionId: string,
        private readonly settingsManager: SettingsManager,
        private readonly app: App,
        private readonly environmentVariableProvider: EnvironmentVariableProvider,
    ) {}

    public getValue<T>(key: string): T {
        return this.settingsManager.getValue(
            getExtensionSettingKey(this.extensionId, key),
            <T>this.getDefaultValue(key),
        );
    }

    public getDefaultValue(key: string) {
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
            linuxFolders: (
                this.environmentVariableProvider.get("XDG_DATA_DIRS") ||
                `${join("/", "usr", "local", "share")}:${join("/", "usr", "share")}`
            )
                .split(":")
                .map((dir) => join(dir, "applications")),
        };

        return defaultValues[key];
    }
}
