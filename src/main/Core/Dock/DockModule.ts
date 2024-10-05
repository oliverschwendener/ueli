import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";

export class DockModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const app = dependencyRegistry.get("App");
        const settingsManager = dependencyRegistry.get("SettingsManager");
        const eventSubscriber = dependencyRegistry.get("EventSubscriber");

        const toggleAppIconInDock = () => {
            const showAppIconInDock = settingsManager.getValue("appearance.showAppIconInDock", false);
            if (showAppIconInDock) {
                app.dock?.show();
            } else {
                app.dock?.hide();
            }
        };
        toggleAppIconInDock();

        eventSubscriber.subscribe("settingUpdated[appearance.showAppIconInDock]", toggleAppIconInDock);
    }
}
