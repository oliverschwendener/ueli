import type { SafeStorageEncryption } from "@Core/SafeStorageEncryption";
import { describe, expect, it, vi } from "vitest";
import type { EventEmitter } from "../EventEmitter";
import type { Settings } from "../Settings";
import type { SettingsReader } from "../SettingsReader";
import type { SettingsWriter } from "../SettingsWriter";
import { SettingsManager } from "./SettingsManager";

describe(SettingsManager, () => {
    it("should read the settings when instantiating the class", () => {
        const emitEventMock = vi.fn();
        const readSettingsMock = vi.fn().mockReturnValue({ key1: "value1", key2: "value2", key3: "value3" });

        const eventEmitter = <EventEmitter>{ emitEvent: (eventName, data) => emitEventMock(eventName, data) };
        const settingsReader = <SettingsReader>{ readSettings: () => readSettingsMock() };
        const settingsWriter = <SettingsWriter>{};
        const safeStorage = <SafeStorageEncryption>{};

        new SettingsManager(settingsReader, settingsWriter, eventEmitter, safeStorage);

        expect(readSettingsMock).toHaveBeenCalledOnce();
    });

    it("should get value", () => {
        const emitEventMock = vi.fn();
        const readSettingsMock = vi.fn().mockReturnValue({ key1: "value1" });

        const eventEmitter = <EventEmitter>{ emitEvent: (eventName, data) => emitEventMock(eventName, data) };
        const settingsReader = <SettingsReader>{ readSettings: () => readSettingsMock() };
        const settingsWriter = <SettingsWriter>{};
        const safeStorage = <SafeStorageEncryption>{};

        const settingsManager = new SettingsManager(settingsReader, settingsWriter, eventEmitter, safeStorage);

        expect(settingsManager.getValue("key1", undefined)).toBe("value1");
        expect(settingsManager.getValue("key4", undefined)).toBe(undefined);
        expect(settingsManager.getValue("key5", "defaultValue5")).toBe("defaultValue5");
        expect(readSettingsMock).toBeCalledTimes(1);
    });

    it("should decrypt a value if it's sensitive", () => {
        const emitEventMock = vi.fn();
        const readSettingsMock = vi.fn().mockReturnValue({ key1: "encryptedValue1" });
        const decryptStringMock = vi.fn().mockReturnValue("decryptedValue1");

        const eventEmitter = <EventEmitter>{ emitEvent: (eventName, data) => emitEventMock(eventName, data) };
        const settingsReader = <SettingsReader>{ readSettings: () => readSettingsMock() };
        const settingsWriter = <SettingsWriter>{};
        const safeStorage = <SafeStorageEncryption>{ decryptString: (text) => decryptStringMock(text) };

        const settingsManager = new SettingsManager(settingsReader, settingsWriter, eventEmitter, safeStorage);

        expect(settingsManager.getValue("key1", "defaultValue", true)).toBe("decryptedValue1");
        expect(decryptStringMock).toHaveBeenCalledWith("encryptedValue1");
    });

    it("should update value", async () => {
        const settings: Settings = { key1: "value1", key2: "value2", key3: "value3" };

        const emitEventMock = vi.fn();
        const readSettingsMock = vi.fn().mockReturnValue(settings);
        const writeSettingsMock = vi.fn();

        const eventEmitter = <EventEmitter>{ emitEvent: (eventName, data) => emitEventMock(eventName, data) };
        const settingsReader = <SettingsReader>{ readSettings: () => readSettingsMock() };
        const settingsWriter = <SettingsWriter>{ writeSettings: (settings) => writeSettingsMock(settings) };
        const safeStorage = <SafeStorageEncryption>{};

        const settingsManager = new SettingsManager(settingsReader, settingsWriter, eventEmitter, safeStorage);

        await settingsManager.updateValue("key4", "value4");

        expect(writeSettingsMock).toHaveBeenCalledWith({ ...settings, ...{ key4: "value4" } });
        expect(emitEventMock).toHaveBeenCalledWith("settingUpdated[key4]", { value: "value4" });
        expect(emitEventMock).toHaveBeenCalledWith("settingUpdated", { key: "key4", value: "value4" });
    });

    it("should encrypt a value if it's sensitive", async () => {
        const emitEventMock = vi.fn();
        const readSettingsMock = vi.fn().mockReturnValue({});
        const writeSettingsMock = vi.fn();
        const encryptStringMock = vi.fn().mockReturnValue("encryptedValue1");

        const eventEmitter = <EventEmitter>{ emitEvent: (eventName, data) => emitEventMock(eventName, data) };
        const settingsReader = <SettingsReader>{ readSettings: () => readSettingsMock() };
        const settingsWriter = <SettingsWriter>{ writeSettings: (settings) => writeSettingsMock(settings) };
        const safeStorage = <SafeStorageEncryption>{ encryptString: (plainText) => encryptStringMock(plainText) };

        const settingsManager = new SettingsManager(settingsReader, settingsWriter, eventEmitter, safeStorage);

        await settingsManager.updateValue("key1", "decryptedValue1", true);

        expect(writeSettingsMock).toHaveBeenCalledWith({ key1: "encryptedValue1" });
        expect(emitEventMock).toHaveBeenCalledWith("settingUpdated[key1]", { value: "decryptedValue1" });
        expect(emitEventMock).toHaveBeenCalledWith("settingUpdated", { key: "key1", value: "decryptedValue1" });
        expect(encryptStringMock).toHaveBeenCalledWith("decryptedValue1");
    });

    it("should reset all settings", async () => {
        const readSettingsMock = vi.fn().mockReturnValue({ key1: "value1" });
        const writeSettingsMock = vi.fn();

        const eventEmitter = <EventEmitter>{};
        const settingsReader = <SettingsReader>{ readSettings: () => readSettingsMock() };
        const settingsWriter = <SettingsWriter>{ writeSettings: (settings) => writeSettingsMock(settings) };
        const safeStorage = <SafeStorageEncryption>{};

        const settingsManager = new SettingsManager(settingsReader, settingsWriter, eventEmitter, safeStorage);

        await settingsManager.resetAllSettings();

        expect(readSettingsMock).toHaveBeenCalledOnce();
        expect(settingsManager.settings).toEqual({});
        expect(writeSettingsMock).toHaveBeenCalledWith({});
    });
});
