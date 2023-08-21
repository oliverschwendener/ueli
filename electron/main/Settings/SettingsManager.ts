import { Settings } from "@common/Settings";
import { SettingsReader } from "./SettingsReader";
import { SettingsWriter } from "./SettingsWriter";

export class SettingsManager {
    private settings: Settings;

    public constructor(
        private readonly settingsReader: SettingsReader,
        private readonly settingsWriter: SettingsWriter,
    ) {
        this.settings = this.settingsReader.readSettings();
    }

    public getSettings(): Settings {
        return this.settings;
    }

    public getSettingByKey<T>(key: string, defaultValue?: T): T {
        return (this.settings[key] as T) ?? defaultValue;
    }

    public async saveSetting<T>(key: string, value: T): Promise<void> {
        this.settings[key] = value;
        return this.settingsWriter.writeSettings(this.settings);
    }
}
