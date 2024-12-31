import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import type { UeliCommandInvokedEvent } from "@Core/UeliCommand";
import { RescanOrchestrator } from "./RescanOrchestrator";

export class RescanOrchestratorModule {
    public static bootstrap(moduleRegistry: UeliModuleRegistry): void {
        const eventSubscriber = moduleRegistry.get("EventSubscriber");

        const rescanOrchestrator = new RescanOrchestrator(
            moduleRegistry.get("EventEmitter"),
            moduleRegistry.get("SettingsManager"),
            moduleRegistry.get("TaskScheduler"),
        );

        const automaticRescanIsEnabled = () => {
            const settingsManager = moduleRegistry.get("SettingsManager");
            return settingsManager.getValue("searchEngine.automaticRescan", true);
        };

        if (automaticRescanIsEnabled()) {
            rescanOrchestrator.scanUntilCancelled();
        } else {
            rescanOrchestrator.scanOnce();
        }

        eventSubscriber.subscribe("settingUpdated[searchEngine.rescanIntervalInSeconds]", () => {
            rescanOrchestrator.cancel();
            rescanOrchestrator.scanUntilCancelled();
        });

        eventSubscriber.subscribe("settingUpdated[searchEngine.automaticRescan]", () => {
            if (automaticRescanIsEnabled()) {
                rescanOrchestrator.scanUntilCancelled();
            } else {
                rescanOrchestrator.cancel();
            }
        });

        eventSubscriber.subscribe("ueliCommandInvoked", ({ ueliCommand }: UeliCommandInvokedEvent<unknown>) => {
            if (ueliCommand === "rescanExtensions") {
                rescanOrchestrator.cancel();
                rescanOrchestrator.scanUntilCancelled();
            }
        });
    }
}
