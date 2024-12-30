import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { join } from "path";

export class SettingsFileModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const app = moduleRegistry.get("App");

        moduleRegistry.register("SettingsFile", {
            path: join(app.getPath("userData"), "ueli9.settings.json"),
        });
    }
}
