import type { Settings } from "@common/Settings";
import { readFileSync } from "fs";
import { SettingsReader } from "./SettingsReader";

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
