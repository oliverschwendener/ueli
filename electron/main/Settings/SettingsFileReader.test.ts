import { Settings } from "@common/Settings";
import { unlinkSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { afterEach, describe, expect, it } from "vitest";
import { SettingsFileReader } from "./SettingsFileReader";

const settingsFilePath = join(__dirname, "settings.json");

const settings: Settings = {
    key1: "value1",
    key2: "value2",
    key3: "value3",
};

describe(SettingsFileReader, () => {
    afterEach(() => {
        if (existsSync(settingsFilePath)) {
            unlinkSync(settingsFilePath);
        }
    });

    it("should read settings from a json file", () => {
        writeFileSync(settingsFilePath, JSON.stringify(settings), "utf-8");
        const settingsFileReader = new SettingsFileReader(settingsFilePath);
        expect(settingsFileReader.readSettings()).toEqual(settings);
    });

    it("should return an empty object if the settings file does not exist", () => {
        const settingsFileReader = new SettingsFileReader(settingsFilePath);
        expect(settingsFileReader.readSettings()).toEqual({});
    });
});
