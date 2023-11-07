import type { DependencyInjector } from "@common/DependencyInjector";
import type { SettingsFile } from "@common/SettingsFile";
import type { App } from "electron";
import { join } from "path";

export const useSettingsFile = (dependencyInjector: DependencyInjector) => {
    const app = dependencyInjector.getInstance<App>("App");

    dependencyInjector.registerInstance<SettingsFile>("SettingsFile", {
        path: join(app.getPath("userData"), "ueli9.settings.json"),
    });
};
