import type { Settings } from "@common/Settings";
import type { SettingsManager } from "@common/SettingsManager";
import type { SettingsReader } from "@common/SettingsReader";
import type { SettingsWriter } from "@common/SettingsWriter";

export class RealSettingsManager implements SettingsManager {
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
