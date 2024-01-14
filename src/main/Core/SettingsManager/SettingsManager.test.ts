import { describe, expect, it, vi } from "vitest";
import type { EventEmitter } from "../EventEmitter";
import type { Settings } from "../Settings";
import type { SettingsReader } from "../SettingsReader";
import type { SettingsWriter } from "../SettingsWriter";
import { SettingsManager } from "./SettingsManager";

describe(SettingsManager, () => {
    it("should read the settings when instantiating the class", () => {
        const settings: Settings = {
            key1: "value1",
            key2: "value2",
            key3: "value3",
        };

        const emitEventMock = vi.fn();
        const readSettingsMock = vi.fn().mockReturnValue(settings);

        const eventEmitter = <EventEmitter>{
            emitEvent: (eventName, data) => emitEventMock(eventName, data),
        };

        const settingsReader = <SettingsReader>{
            readSettings: () => readSettingsMock(),
        };

        const settingsWriter = <SettingsWriter>{};

        new SettingsManager(settingsReader, settingsWriter, eventEmitter);

        expect(readSettingsMock).toHaveBeenCalledOnce();
    });

    it("should get a setting by key", () => {
        const emitEventMock = vi.fn();
        const readSettingsMock = vi.fn().mockReturnValue({ key1: "value1" });

        const eventEmitter = <EventEmitter>{
            emitEvent: (eventName, data) => emitEventMock(eventName, data),
        };

        const settingsReader = <SettingsReader>{
            readSettings: () => readSettingsMock(),
        };

        const settingsManager = new SettingsManager(settingsReader, <SettingsWriter>{}, eventEmitter);

        expect(settingsManager.getValue("key1", undefined)).toBe("value1");
        expect(settingsManager.getValue("key4", undefined)).toBe(undefined);
        expect(settingsManager.getValue("key5", "defaultValue5")).toBe("defaultValue5");
    });

    it("should get a extension setting by extension id and key", () => {
        const settings: Settings = {
            key1: "value1",
            "extension[testExtensionId].key1": "extensionValue",
        };

        const emitEventMock = vi.fn();
        const readSettingsMock = vi.fn().mockReturnValue(settings);

        const eventEmitter = <EventEmitter>{
            emitEvent: (eventName, data) => emitEventMock(eventName, data),
        };

        const settingsReader = <SettingsReader>{
            readSettings: () => readSettingsMock(),
        };

        const settingsManager = new SettingsManager(settingsReader, <SettingsWriter>{}, eventEmitter);

        expect(settingsManager.getExtensionValue("testExtensionId", "key1", undefined)).toBe("extensionValue");
        expect(settingsManager.getExtensionValue("testExtensionId", "key2", undefined)).toBe(undefined);
        expect(settingsManager.getExtensionValue("testExtensionId", "key2", "defaultValue")).toBe("defaultValue");
        expect(settingsManager.getExtensionValue("testExtensionId2", "key", undefined)).toBe(undefined);
    });

    it("should save a setting by key", async () => {
        const settings: Settings = {
            key1: "value1",
            key2: "value2",
            key3: "value3",
        };

        const emitEventMock = vi.fn();
        const readSettingsMock = vi.fn().mockReturnValue(settings);
        const writeSettingsMock = vi.fn();

        const eventEmitter = <EventEmitter>{
            emitEvent: (eventName, data) => emitEventMock(eventName, data),
        };

        const settingsReader = <SettingsReader>{
            readSettings: () => readSettingsMock(),
        };

        const settingsWriter = <SettingsWriter>{
            writeSettings: (settings) => writeSettingsMock(settings),
        };

        const settingsManager = new SettingsManager(settingsReader, settingsWriter, eventEmitter);
        await settingsManager.updateValue("key4", "value4");

        expect(writeSettingsMock).toHaveBeenCalledWith({ ...settings, ...{ key4: "value4" } });
        expect(emitEventMock).toHaveBeenCalledWith("settingUpdated[key4]", { value: "value4" });
        expect(emitEventMock).toHaveBeenCalledWith("settingUpdated", { key: "key4", value: "value4" });
    });
});
