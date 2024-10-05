import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";

export class DockModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const app = dependencyRegistry.get("App");
        const settingsManager = dependencyRegistry.get("SettingsManager");
        const showAppIconInDock = settingsManager.getValue("appearance.showAppIconInDock", false);
        this.toggleAppIconInDock(app, showAppIconInDock);

        const eventSubscriber = dependencyRegistry.get("EventSubscriber");
        eventSubscriber.subscribe("settingUpdated[appearance.showAppIconInDock]", ({ value }: { value: boolean }) => {
            this.toggleAppIconInDock(app, value);
        });
    }

    private static toggleAppIconInDock(app: Electron.App, showAppIconInDock: boolean) {
        if (showAppIconInDock) {
            app.dock?.show();
        } else {
            app.dock?.hide();
        }
    }
}
