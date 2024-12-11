import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { UeliCommandActionHandler } from "./UeliCommandActionHandler";
import { UeliCommandInvoker } from "./UeliCommandInvoker";

export class UeliCommandModule {
    public static bootstrap(dependencyRegistry: DependencyRegistry<Dependencies>) {
        const app = dependencyRegistry.get("App");
        const eventEmitter = dependencyRegistry.get("EventEmitter");
        const actionHandlerRegistry = dependencyRegistry.get("ActionHandlerRegistry");
        const settingsManager = dependencyRegistry.get("SettingsManager");

        const ueliCommandInvoker = new UeliCommandInvoker(app, eventEmitter, settingsManager);

        dependencyRegistry.register("UeliCommandInvoker", ueliCommandInvoker);

        actionHandlerRegistry.register(new UeliCommandActionHandler(ueliCommandInvoker));
    }
}
