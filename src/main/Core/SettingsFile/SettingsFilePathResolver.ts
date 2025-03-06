import type { App } from "electron";
import { join } from "path";

export class SettingsFilePathResolver {
    public constructor(private readonly app: App) {}

    public async resolve(): Promise<string> {
        return this.getDefaultSettingsFilePath();
    }

    private getDefaultSettingsFilePath(): string {
        return join(this.app.getPath("userData"), "ueli9.settings.json");
    }
}
