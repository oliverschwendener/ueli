import type { EventEmitter } from "../EventEmitter";
import type { Settings } from "../Settings";
import type { SettingsReader } from "../SettingsReader";
import type { SettingsWriter } from "../SettingsWriter";
import type { SettingsManager as SettingsManagerInterface } from "./Contract";

export class SettingsManager implements SettingsManagerInterface {
    private readonly settings: Settings;

    public constructor(
        private readonly settingsReader: SettingsReader,
        private readonly settingsWriter: SettingsWriter,
        private readonly eventEmitter: EventEmitter,
    ) {
        this.settings = this.settingsReader.readSettings();
    }

    public getExtensionSettingByKey<T>(extensionId: string, key: string, defaultValue: T): T {
        return this.getSettingByKey<T>(`extension[${extensionId}].${key}`, defaultValue);
    }

    public getSettingByKey<T>(key: string, defaultValue: T): T {
        return (this.settings[key] as T | undefined) ?? defaultValue;
    }

    public async saveSetting<T>(key: string, value: T): Promise<void> {
        this.settings[key] = value;
        this.eventEmitter.emitEvent("settingUpdated", { key, value });
        this.eventEmitter.emitEvent(`settingUpdated[${key}]`, { value });
        return this.settingsWriter.writeSettings(this.settings);
    }
}
