import type { App } from "electron";
import { join } from "path";

export const useSettingsFilePath = ({ app }: { app: App }): string =>
    join(app.getPath("userData"), "ueli9.settings.json");
