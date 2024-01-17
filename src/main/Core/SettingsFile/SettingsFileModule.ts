import { join } from "path";
import type { DependencyRegistry } from "../DependencyRegistry";

export class SettingsFileModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry) {
        const app = dependencyRegistry.get("App");

        dependencyRegistry.register("SettingsFile", {
            path: join(app.getPath("userData"), "ueli9.settings.json"),
        });
    }
}
