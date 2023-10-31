import type { Settings } from "@common/Settings";
import type { SettingsReader } from "@common/SettingsReader";
import type { SettingsWriter } from "@common/SettingsWriter";
import { describe, expect, it } from "vitest";
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

        const settingsReader = getDummySettingsReader(settings);
        const settingsManager = new SettingsManager(settingsReader, getDummySettingsWriter());
        expect(settingsManager.getSettings()).toBe(settings);
    });

    it("should get a setting by key", () => {
        const settings: Settings = {
            key1: "value1",
            key2: "value2",
            key3: "value3",
        };

        const settingsReader = getDummySettingsReader(settings);
        const settingsManager = new SettingsManager(settingsReader, getDummySettingsWriter());
        expect(settingsManager.getSettingByKey("key1", undefined)).toBe("value1");
        expect(settingsManager.getSettingByKey("key4", undefined)).toBe(undefined);
        expect(settingsManager.getSettingByKey("key5", "defaultValue5")).toBe("defaultValue5");
    });

    it("should get a plugin setting by plugin id and key", () => {
        const settings: Settings = {
            key1: "value1",
            "plugin[testPluginId].key1": "pluginValue",
        };

        const settingsReader = getDummySettingsReader(settings);
        const settingsManager = new SettingsManager(settingsReader, getDummySettingsWriter());

        expect(settingsManager.getPluginSettingByKey("testPluginId", "key1", undefined)).toBe("pluginValue");
        expect(settingsManager.getPluginSettingByKey("testPluginId", "key2", undefined)).toBe(undefined);
        expect(settingsManager.getPluginSettingByKey("testPluginId", "key2", "defaultValue")).toBe("defaultValue");
        expect(settingsManager.getPluginSettingByKey("testPluginId2", "key", undefined)).toBe(undefined);
    });

    it("should save a setting by key", async () => {
        const settings: Settings = {
            key1: "value1",
            key2: "value2",
            key3: "value3",
        };

        const settingsReader = getDummySettingsReader(settings);
        const settingsWriter = getDummySettingsWriter();

        expect(settingsWriter.getWriteCounter()).toBe(0);

        const settingsManager = new SettingsManager(settingsReader, settingsWriter);
        await settingsManager.saveSetting("key4", "value4");

        expect(settingsManager.getSettings()).toEqual({ ...settings, ...{ key4: "value4" } });
        expect(settingsWriter.getWriteCounter()).toBe(1);
    });
});
