import { Settings } from "@common/Settings";
import { SettingsWriter } from "./SettingsWriter";
import { writeFile } from "fs";

export class SettingsFileWriter implements SettingsWriter {
    public constructor(private readonly settingsFilePath: string) {}

    public writeSettings(settings: Settings): Promise<void> {
        return new Promise((resolve, reject) => {
            writeFile(
                this.settingsFilePath,
                JSON.stringify(SettingsFileWriter.sortSettingsAlphabetically(settings), null, 4),
                "utf-8",
                (error) => (error ? reject(error) : resolve()),
            );
        });
    }

    private static sortSettingsAlphabetically(settings: Settings): Settings {
        const result: Settings = {};

        for (const key of Object.keys(settings).sort()) {
            result[key] = settings[key];
        }

        return result;
    }
}
