import { readFileSync } from "fs";
import type { Settings } from "../Settings";
import type { SettingsReader } from "./Contract";

export class SettingsFileReader implements SettingsReader {
    public constructor(private readonly settingsFilePath: string) {}

    public readSettings(): Settings {
        return this.readSettingsFromPath(this.settingsFilePath);
    }

    public readSettingsFromPath(filePath: string): Settings {
        try {
            return JSON.parse(readFileSync(filePath, "utf-8"));
        } catch (error) {
            return {};
        }
    }
}
