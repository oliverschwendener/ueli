import type { App } from "electron";
import { join } from "path";
import type { SettingsFilePathSource } from "./SettingsFilePathSource";

export class DefaultSettingsFilePathSource implements SettingsFilePathSource {
    public constructor(private readonly app: App) {}

    public getSettingsFilePath(): string {
        return join(this.app.getPath("userData"), "ueli9.settings.json");
    }
}
