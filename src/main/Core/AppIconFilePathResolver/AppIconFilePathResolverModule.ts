import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { AppIconFilePathResolver } from "./AppIconFilePathResolver";

export class AppIconFilePathResolverModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const resolver = new AppIconFilePathResolver(
            moduleRegistry.get("NativeTheme"),
            moduleRegistry.get("AssetPathResolver"),
            moduleRegistry.get("OperatingSystem"),
        );

        moduleRegistry.register("AppIconFilePathResolver", resolver);
    }
}
