import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { AppIconFilePathResolver as AppIconFilePathResolverImpl } from "./AppIconFilePathResolver";

export class AppIconFilePathResolverModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const resolver = new AppIconFilePathResolverImpl(
            moduleRegistry.get("NativeTheme"),
            moduleRegistry.get("AssetPathResolver"),
            moduleRegistry.get("OperatingSystem"),
        );

        moduleRegistry.register("AppIconFilePathResolver", resolver);
    }
}
