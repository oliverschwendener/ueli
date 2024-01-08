import type { App } from "electron";
import { join } from "path";
import type { SettingDefaultValueProvider } from "../SettingDefaultValueProvider";

export class WindowsSettingDefaultValueProvider implements SettingDefaultValueProvider {
    public constructor(private readonly app: App) {}

    public getDefaultValue<T>(settingKey: string): T {
        const values: Record<string, unknown> = {
            windowsFolders: [
                "C:\\ProgramData\\Microsoft\\Windows\\Start Menu",
                join(this.app.getPath("home"), "AppData", "Roaming", "Microsoft", "Windows", "Start Menu"),
            ],
            windowsFileExtensions: ["lnk"],
        };

        return values[settingKey] as T;
    }
}
