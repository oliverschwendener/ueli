import type { Settings } from "../Settings";
import type { SettingsReader } from "../SettingsReader";
import type { SettingsWriter } from "../SettingsWriter";
import type { SettingsManager as SettingsManagerInterface } from "./Contract";

export class SettingsManager implements SettingsManagerInterface {
    private readonly settings: Settings;

    public constructor(
        private readonly settingsReader: SettingsReader,
        private readonly settingsWriter: SettingsWriter,
    ) {
        this.settings = this.settingsReader.readSettings();
    }

    public getSettings(): Settings {
        return this.settings;
    }

    public getPluginSettingByKey<T>(pluginId: string, key: string, defaultValue: T): T {
        return this.getSettingByKey<T>(`plugin[${pluginId}].${key}`, defaultValue);
    }

    public getSettingByKey<T>(key: string, defaultValue: T): T {
        return (this.settings[key] as T | undefined) ?? defaultValue;
    }

    public async saveSetting<T>(key: string, value: T): Promise<void> {
        this.settings[key] = value;
        return this.settingsWriter.writeSettings(this.settings);
    }
}
