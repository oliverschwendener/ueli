import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { RescanOrchestrator } from "./RescanOrchestrator";

export class RescanOrchestratorModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>): void {
        const eventSubscriber = dependencyRegistry.get("EventSubscriber");
        const rescanOrchestrator = new RescanOrchestrator(
            dependencyRegistry.get("EventEmitter"),
            dependencyRegistry.get("SettingsManager"),
            dependencyRegistry.get("TaskScheduler"),
        );

        const automaticRescanIsEnabled = () => {
            const settingsManager = dependencyRegistry.get("SettingsManager");
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

        eventSubscriber.subscribe("ueliCommandInvoked", async () => {
            rescanOrchestrator.cancel();
            rescanOrchestrator.scanUntilCancelled();
        });
    }
}
