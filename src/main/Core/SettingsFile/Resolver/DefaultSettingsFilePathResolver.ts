import type { App } from "electron";
import { join } from "path";

export class DefaultSettingsFilePathResolver {
    public constructor(private readonly app: App) {}

    public resolve(): string {
        return join(this.app.getPath("userData"), "ueli9.settings.json");
    }
}
