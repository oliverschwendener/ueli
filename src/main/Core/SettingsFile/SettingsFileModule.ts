import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { join } from "path";

export class SettingsFileModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const app = dependencyRegistry.get("App");

        dependencyRegistry.register("SettingsFile", {
            path: join(app.getPath("userData"), "ueli9.settings.json"),
        });
    }
}
