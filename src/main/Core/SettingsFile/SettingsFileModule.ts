import { join } from "path";
import type { DependencyInjector } from "../DependencyInjector";

export class SettingsFileModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const app = dependencyInjector.getInstance("App");

        dependencyInjector.registerInstance("SettingsFile", {
            path: join(app.getPath("userData"), "ueli9.settings.json"),
        });
    }
}
