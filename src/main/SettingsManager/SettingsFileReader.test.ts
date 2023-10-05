import type { Settings } from "@common/Settings";
import { existsSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { SettingsFileReader } from "./SettingsFileReader";

const settingsFilePath = join(__dirname, "settings.json");

const settings: Settings = {
    key1: "value1",
    key2: "value2",
    key3: "value3",
};

const removeFileIfExists = (filePath: string) => {
    if (existsSync(filePath)) {
        unlinkSync(filePath);
    }
};

describe(SettingsFileReader, () => {
    beforeEach(() => removeFileIfExists(settingsFilePath));
    afterEach(() => removeFileIfExists(settingsFilePath));

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
