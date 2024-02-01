import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";

export class AutostartModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const app = dependencyRegistry.get("App");
        const settingsManager = dependencyRegistry.get("SettingsManager");
        const eventSubscriber = dependencyRegistry.get("EventSubscriber");
        const logger = dependencyRegistry.get("Logger");

        const setAutostartOptions = () => {
            if (!app.isPackaged) {
                logger.info("Skipping setAutostartOptions. Reason: app is not packaged");
                return;
            }

            app.setLoginItemSettings({
                args: [],
                openAtLogin: settingsManager.getValue("general.autostartApp", false),
                path: process.execPath,
            });
        };

        eventSubscriber.subscribe("settingUpdated[general.autostartApp]", () => setAutostartOptions());

        setAutostartOptions();
    }
}
