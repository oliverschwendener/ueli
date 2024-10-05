import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";

export class DockModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const app = dependencyRegistry.get("App");
        const settingsManager = dependencyRegistry.get("SettingsManager");
        const eventSubscriber = dependencyRegistry.get("EventSubscriber");

        const setAppIconVisibility = () => {
            if (settingsManager.getValue("appearance.showAppIconInDock", false)) {
                app.dock?.show();
            } else {
                app.dock?.hide();
            }
        };

        setAppIconVisibility();

        eventSubscriber.subscribe("settingUpdated[appearance.showAppIconInDock]", setAppIconVisibility);
    }
}
