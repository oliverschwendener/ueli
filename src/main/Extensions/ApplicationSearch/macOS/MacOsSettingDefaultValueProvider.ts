import type { App } from "electron";
import { join } from "path";
import type { SettingDefaultValueProvider } from "../SettingDefaultValueProvider";

export class MacOsSettingDefaultValueProvider implements SettingDefaultValueProvider {
    public constructor(private app: App) {}

    public getDefaultValue<T>(settingKey: string): T {
        const defaultValues: Record<string, unknown> = {
            macOsFolders: [
                "/System/Applications",
                "/System/Library/CoreServices",
                "/Applications",
                join(this.app.getPath("home"), "Applications"),
            ],
        };

        return defaultValues[settingKey] as T;
    }
}
