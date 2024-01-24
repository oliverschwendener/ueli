import type { SafeStorageEncryption } from "@Core/SafeStorageEncryption";
import type { EventEmitter } from "../EventEmitter";
import type { Settings } from "../Settings";
import type { SettingsReader } from "../SettingsReader";
import type { SettingsWriter } from "../SettingsWriter";
import type { SettingsManager as SettingsManagerInterface } from "./Contract";

export class SettingsManager implements SettingsManagerInterface {
    public readonly settings: Settings;

    public constructor(
        private readonly settingsReader: SettingsReader,
        private readonly settingsWriter: SettingsWriter,
        private readonly eventEmitter: EventEmitter,
        private readonly safeStorageEncryption: SafeStorageEncryption,
    ) {
        this.settings = this.settingsReader.readSettings();
    }

    public getValue<T>(key: string, defaultValue: T, isSensitive?: boolean): T {
        if (Object.keys(this.settings).includes(key)) {
            const value = this.settings[key] as T;
            return isSensitive ? this.decryptValue<T>(value as string) : value;
        }

        return defaultValue;
    }

    public async updateValue<T>(key: string, value: T, isSensitive?: boolean): Promise<void> {
        this.settings[key] = isSensitive ? this.encryptValue<T>(value) : value;
        this.eventEmitter.emitEvent("settingUpdated", { key, value });
        this.eventEmitter.emitEvent(`settingUpdated[${key}]`, { value });
        await this.saveChanges();
    }

    public async resetAllSettings(): Promise<void> {
        for (const key of Object.keys(this.settings)) {
            delete this.settings[key];
        }

        await this.saveChanges();
    }

    private async saveChanges(): Promise<void> {
        await this.settingsWriter.writeSettings(this.settings);
    }

    private encryptValue<T>(plainText: T): T {
        return this.safeStorageEncryption.encryptString(plainText as string) as T;
    }

    private decryptValue<T>(encryptedValue: string): T {
        return this.safeStorageEncryption.decryptString(encryptedValue) as T;
    }
}
