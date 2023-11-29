import type { App } from "electron";
import { join } from "path";
import type { DependencyInjector } from "../DependencyInjector";
import type { SettingsFile } from "./Contract";

export class SettingsFileModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const app = dependencyInjector.getInstance<App>("App");

        dependencyInjector.registerInstance<SettingsFile>("SettingsFile", {
            path: join(app.getPath("userData"), "ueli9.settings.json"),
        });
    }
}
