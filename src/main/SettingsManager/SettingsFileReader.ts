import type { Settings } from "@common/Settings";
import type { SettingsReader } from "@common/SettingsReader";
import { readFileSync } from "fs";

export class SettingsFileReader implements SettingsReader {
    public constructor(private readonly settingsFilePath: string) {}

    public readSettings(): Settings {
        try {
            return JSON.parse(readFileSync(this.settingsFilePath, "utf-8"));
        } catch (error) {
            return {};
        }
    }
}
