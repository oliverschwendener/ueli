import type { UeliModuleRegistry } from "@Core/ModuleRegistry";

export class CommandlineSwitchModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry): void {
        const app = moduleRegistry.get("App");
        const operatingSystem = moduleRegistry.get("OperatingSystem");

        // Prevents the app to flash on Windows: https://github.com/electron/electron/issues/22691
        if (operatingSystem === "Windows") {
            app.commandLine.appendSwitch("wm-window-animations-disabled");
        }
    }
}
