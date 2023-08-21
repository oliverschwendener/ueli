import { Settings } from "@common/Settings";
import { SettingsWriter } from "./SettingsWriter";
import { writeFile } from "fs";

export class SettingsFileWriter implements SettingsWriter {
    public constructor(private readonly settingsFilePath: string) {}

    public writeSettings(settings: Settings): Promise<void> {
        return new Promise((resolve, reject) => {
            writeFile(this.settingsFilePath, JSON.stringify(settings), "utf-8", (error) => {
                error ? reject(error) : resolve();
            });
        });
    }
}
