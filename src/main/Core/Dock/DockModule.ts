import type { UeliModuleRegistry } from "@Core/ModuleRegistry";

export class DockModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry) {
        const app = moduleRegistry.get("App");
        const settingsManager = moduleRegistry.get("SettingsManager");
        const eventSubscriber = moduleRegistry.get("EventSubscriber");

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
