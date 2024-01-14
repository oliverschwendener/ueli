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

    public getExtensionValue<T>(extensionId: string, key: string, defaultValue: T): T {
        return this.getValue<T>(this.getExtensionSettingKey(extensionId, key), defaultValue);
    }

    public getValue<T>(key: string, defaultValue: T): T {
        return (this.settings[key] as T | undefined) ?? defaultValue;
    }

    public async updateValue<T>(key: string, value: T): Promise<void> {
        return this.save(key, value);
    }

    public async updateExtensionValue<T>(extensionId: string, key: string, value: T): Promise<void> {
        return this.save(this.getExtensionSettingKey(extensionId, key), value);
    }

    private async save<T>(key: string, value: T): Promise<void> {
        this.settings[key] = value;
        this.eventEmitter.emitEvent("settingUpdated", { key, value });
        this.eventEmitter.emitEvent(`settingUpdated[${key}]`, { value });
        return this.settingsWriter.writeSettings(this.settings);
    }

    private getExtensionSettingKey(extensionId: string, key: string): string {
        return `extension[${extensionId}].${key}`;
    }
}
