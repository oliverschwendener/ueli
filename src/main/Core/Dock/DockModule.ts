import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";

export class DockModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const app = dependencyRegistry.get("App");
        const settingsManager = dependencyRegistry.get("SettingsManager");
        const eventSubscriber = dependencyRegistry.get("EventSubscriber");

        const setAppIconVisibility = async () => {
            if (settingsManager.getValue("appearance.showAppIconInDock", false)) {
                await app.dock?.show();
            } else {
                app.dock?.hide();
            }
        };

        /**
         * For some reason the dock icon won't be hidden if we do this immediately.
         * This is a workaround to hide the dock icon after a short delay.
         */
        setTimeout(() => setAppIconVisibility(), 2500);

        eventSubscriber.subscribe("settingUpdated[appearance.showAppIconInDock]", setAppIconVisibility);
    }
}
