import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";

export class CommandlineSwitchModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): void {
        const app = dependencyRegistry.get("App");
        const operatingSystem = dependencyRegistry.get("OperatingSystem");

        // Prevents the app to flash on Windows: https://github.com/electron/electron/issues/22691
        if (operatingSystem === "Windows") {
            app.commandLine.appendSwitch("wm-window-animations-disabled");
        }
    }
}
