import { describe, expect, it, vi } from "vitest";
import { EventEmitter } from "../EventEmitter";
import type { Settings } from "../Settings";
import type { SettingsReader } from "../SettingsReader";
import type { SettingsWriter } from "../SettingsWriter";
import { SettingsManager } from "./SettingsManager";

const getDummySettingsReader = (settings: Settings) =>
    new (class implements SettingsReader {
        public readSettings(): Settings {
            return settings;
        }
    })();

const getDummySettingsWriter = () =>
    new (class implements SettingsWriter {
        private writeCounter: number;

        constructor() {
            this.writeCounter = 0;
        }

        public writeSettings(): Promise<void> {
            this.writeCounter++;
            return Promise.resolve();
        }

        public getWriteCounter(): number {
            return this.writeCounter;
        }
    })();

describe(SettingsManager, () => {
    it("should read the settings when instantiating the class", () => {
        const settings: Settings = {
            key1: "value1",
            key2: "value2",
            key3: "value3",
        };

        const emitEventMock = vi.fn();

        const eventEmitter = <EventEmitter>{
            emitEvent: (eventName, data) => emitEventMock(eventName, data),
        };

        const settingsReader = getDummySettingsReader(settings);
        const settingsManager = new SettingsManager(settingsReader, getDummySettingsWriter(), eventEmitter);
        expect(settingsManager.getSettings()).toBe(settings);
    });

    it("should get a setting by key", () => {
        const settings: Settings = {
            key1: "value1",
            key2: "value2",
            key3: "value3",
        };

        const emitEventMock = vi.fn();

        const eventEmitter = <EventEmitter>{
            emitEvent: (eventName, data) => emitEventMock(eventName, data),
        };

        const settingsReader = getDummySettingsReader(settings);
        const settingsManager = new SettingsManager(settingsReader, getDummySettingsWriter(), eventEmitter);
        expect(settingsManager.getSettingByKey("key1", undefined)).toBe("value1");
        expect(settingsManager.getSettingByKey("key4", undefined)).toBe(undefined);
        expect(settingsManager.getSettingByKey("key5", "defaultValue5")).toBe("defaultValue5");
    });

    it("should get a extension setting by extension id and key", () => {
        const settings: Settings = {
            key1: "value1",
            "extension[testExtensionId].key1": "extensionValue",
        };

        const emitEventMock = vi.fn();

        const eventEmitter = <EventEmitter>{
            emitEvent: (eventName, data) => emitEventMock(eventName, data),
        };

        const settingsReader = getDummySettingsReader(settings);
        const settingsManager = new SettingsManager(settingsReader, getDummySettingsWriter(), eventEmitter);

        expect(settingsManager.getExtensionSettingByKey("testExtensionId", "key1", undefined)).toBe("extensionValue");
        expect(settingsManager.getExtensionSettingByKey("testExtensionId", "key2", undefined)).toBe(undefined);
        expect(settingsManager.getExtensionSettingByKey("testExtensionId", "key2", "defaultValue")).toBe(
            "defaultValue",
        );
        expect(settingsManager.getExtensionSettingByKey("testExtensionId2", "key", undefined)).toBe(undefined);
    });

    it("should save a setting by key", async () => {
        const settings: Settings = {
            key1: "value1",
            key2: "value2",
            key3: "value3",
        };

        const emitEventMock = vi.fn();

        const eventEmitter = <EventEmitter>{
            emitEvent: (eventName, data) => emitEventMock(eventName, data),
        };

        const settingsReader = getDummySettingsReader(settings);
        const settingsWriter = getDummySettingsWriter();

        expect(settingsWriter.getWriteCounter()).toBe(0);

        const settingsManager = new SettingsManager(settingsReader, settingsWriter, eventEmitter);
        await settingsManager.saveSetting("key4", "value4");

        expect(settingsManager.getSettings()).toEqual({ ...settings, ...{ key4: "value4" } });
        expect(settingsWriter.getWriteCounter()).toBe(1);
        expect(emitEventMock).toHaveBeenCalledWith("settingUpdated[key4]", { value: "value4" });
    });
});
