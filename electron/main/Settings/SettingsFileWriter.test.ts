import { Settings } from "@common/Settings";
import { existsSync, readFileSync, unlinkSync } from "fs";
import { join } from "path";
import { afterEach, describe, expect, it } from "vitest";
import { SettingsFileWriter } from "./SettingsFileWriter";

const settingsFilePath = join(__dirname, "settings.json");

const settings: Settings = {
    key1: "value1",
    key2: "value2",
    key3: "value3",
};

describe(SettingsFileWriter, () => {
    afterEach(() => {
        if (existsSync(settingsFilePath)) {
            unlinkSync(settingsFilePath);
        }
    });

    it("should write settings to a JSON file", async () => {
        const settingsFileWriter = new SettingsFileWriter(settingsFilePath);
        await settingsFileWriter.writeSettings(settings);

        expect(JSON.parse(readFileSync(settingsFilePath, "utf-8"))).toEqual(settings);
    });

    it("should return a rejected promise when trying to write a JSON file to an inaccessible file path", async () => {
        const settingsFileWriter = new SettingsFileWriter("/foo/bar");
        let errorCounter = 0;

        try {
            await settingsFileWriter.writeSettings(settings);
        } catch (error) {
            errorCounter++;
        }

        expect(errorCounter).toBe(1);
    });
});
